import { useState, useEffect } from 'react'
import './App.css'
import SummaryCards from './components/SummaryCards'
import Dashboard from './components/Dashboard'
import SubscriptionForm from './components/SubscriptionForm'
import SubscriptionList from './components/SubscriptionList'

function App() {
  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('subscriptions')
    if (saved) {
      return JSON.parse(saved)
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
  }, [subscriptions])

  const handleAddSubscription = (newSubscription) => {
    setSubscriptions([...subscriptions, newSubscription])
  }

  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id))
  }

  const handleToggleStatus = (id) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        return { ...sub, status: sub.status === 'Pausado' ? 'Activo' : 'Pausado' };
      }
      return sub;
    }));
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
      <h1>Subscription Tracker Personal</h1>
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
    </div>
  )
}

export default App
