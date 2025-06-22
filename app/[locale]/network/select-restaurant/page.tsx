'use client';
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useTranslations } from 'next-intl';
import { superAdminRestaurants } from '@/services/api/user';
import { useEffect, useState } from 'react';

const SelectRestaurantPage: React.FC = () => {
    const t = useTranslations();
    const [restaurantList, setRestaurantList] = useState([] as any[]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            const data = await superAdminRestaurants();
            const restaurants = data.data ;
            setRestaurantList(Array.isArray(restaurants) ? restaurants : []);
         
        };
        fetchRestaurants();
    }, []);
    
    return (
        
        <>
        <Navbar userType="admin" t={t} />
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>Select a Restaurant</h1>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px',
                }}
            >
                {restaurantList.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        style={{
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            padding: '20px',
                            backgroundColor: '#fff',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                        }}
                        
              
                    >
                        <h2 style={{ color: '#555', marginBottom: '10px' }}>{restaurant.restaurant_name}</h2>
                        <p style={{ color: '#777' }}>{restaurant.address}</p>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default SelectRestaurantPage;