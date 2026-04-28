import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'
import SummaryCards from './components/SummaryCards'
import Dashboard from './components/Dashboard'
import SubscriptionForm from './components/SubscriptionForm'
import SubscriptionList from './components/SubscriptionList'
import Auth from './components/Auth'
import HelpModal from './components/HelpModal'

function App() {
  const [session, setSession] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchSubscriptions()
    }
  }, [session])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      // Mapear snake_case a camelCase para la app
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        periodicity: item.periodicity,
        category: item.category,
        billingDate: item.billing_date,
        paymentMethod: item.payment_method,
        paymentDetails: item.payment_details,
        comments: item.comments,
        status: item.status
      }))
      
      setSubscriptions(formattedData)
    } catch (error) {
      console.error('Error fetching subscriptions:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubscription = async (newSub) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_id: session.user.id,
            name: newSub.name,
            price: newSub.price,
            periodicity: newSub.periodicity,
            category: newSub.category,
            billing_date: newSub.billingDate,
            payment_method: newSub.paymentMethod,
            payment_details: newSub.paymentDetails,
            comments: newSub.comments,
            status: newSub.status
          }
        ])
        .select()
      
      if (error) throw error
      
      fetchSubscriptions() // Recargar para sincronizar
    } catch (error) {
      console.error('Error adding subscription:', error.message)
      alert('Error al guardar en la nube')
    }
  }

  const handleDeleteSubscription = async (id) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
        
      if (error) throw error
      
      setSubscriptions(subscriptions.filter(sub => sub.id !== id))
    } catch (error) {
      console.error('Error deleting subscription:', error.message)
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const sub = subscriptions.find(s => s.id === id)
      const newStatus = sub.status === 'Pausado' ? 'Activo' : 'Pausado'
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: newStatus })
        .eq('id', id)
        
      if (error) throw error
      
      setSubscriptions(subscriptions.map(s => {
        if (s.id === id) return { ...s, status: newStatus };
        return s;
      }));
    } catch (error) {
      console.error('Error updating status:', error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />
  }

  const calculateAnnual = (subsList) => {
    return subsList.reduce((total, sub) => {
      const periodicity = sub.periodicity || 'Mensual';
      const price = sub.price !== undefined ? sub.price : (sub.monthlyPrice || 0);
      
      let annualCost = 0;
      if (periodicity === 'Mensual') annualCost = price * 12;
      else if (periodicity === 'Trimestral') annualCost = price * 4;
      else if (periodicity === 'Anual') annualCost = price;
      
      return total + annualCost;
    }, 0);
  };

  const activeSubscriptions = subscriptions.filter(sub => sub.status !== 'Pausado');
  
  const totalAnnualAll = calculateAnnual(subscriptions);
  const committedAnnual = calculateAnnual(activeSubscriptions);
  const totalMonthly = committedAnnual / 12;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Subscription Tracker Pro</h1>
        <div className="user-controls">
          <button className="help-btn" onClick={() => setIsHelpOpen(true)} title="Ayuda y FAQs">
            ?
          </button>
          <span className="user-email">{session.user.email}</span>
          <button onClick={handleLogout} className="logout-btn">Salir</button>
        </div>
      </header>
      
      {loading ? (
        <div className="loading-spinner">Cargando datos desde la nube...</div>
      ) : (
        <>
          <SummaryCards 
            totalMonthly={totalMonthly} 
            totalAnnual={totalAnnualAll} 
            committedAnnual={committedAnnual} 
          />
          <Dashboard subscriptions={activeSubscriptions} />
          <SubscriptionForm onAddSubscription={handleAddSubscription} />
          <SubscriptionList 
            subscriptions={subscriptions} 
            onDelete={handleDeleteSubscription} 
            onToggleStatus={handleToggleStatus}
          />
        </>
      )}

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

export default App
