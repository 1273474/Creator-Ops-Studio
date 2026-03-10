import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function DashboardPage(){

    const [user,setUser]  = useState(null);
    const [Deals,setDeals] = useState([]);
    const [loading,setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchData = async ()=> {
            try{
                const token = localStorage.getItem('token');
                if(!token){
                    navigate('/login');
                    return;
                }

                const userResponse = await api.get('/auth/me');
                setUser(userResponse.data);

                const dealResponse = await api.get('/deals');
                setDeals(dealResponse.data);



            }
            catch(err){
                navigate('/login')

            }
            finally{
                setLoading(false);
            }
        };

        fetchData();

    },[]);

    const handleLogout = () => {
        // Clear the token
        localStorage.removeItem('token');
        // Go back to login
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* HEADER */}
            <header className="dashboard-header">
                <h1>CreatorOps Dashboard</h1>
                <div className="header-right">
                    <span>Welcome, {user?.name}!</span>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                <div className="deals-section">
                    <h2>Your Deals ({deals.length})</h2>
                    
                    {deals.length === 0 ? (
                        <p className="no-deals">No deals yet. Create your first one!</p>
                    ) : (
                        <div className="deals-list">
                            {deals.map(deal => (
                                <div key={deal._id} className="deal-card">
                                    <h3>{deal.brandName}</h3>
                                    <p className="deal-value">${deal.value}</p>
                                    <p className="deal-status">{deal.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;








