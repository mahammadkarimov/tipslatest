
import { API_BASE_URL, API_ENDPOINTS, ApiResponse } from '../../lib/api-config';

export const getWaiterData = async (): Promise<any> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/waiter-data`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};




  
export const getWaiterTips = async (): Promise<any> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/waiter-tips`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching waiter tips:', error);
        throw error;
    }
}



export const adminGetTips = async (username?: string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/admin-tips`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "username": username || ""
            }),

        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching admin tips:', error);
        throw error
    }
}



export const adminGetWaiters = async (username?: string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/admin-waiters`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "username": username || ""
            }),

        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching admin waiters:', error);
        throw error;
    }
}


export const adminEditWaiter = async (data: any,username?: string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/admin-waiter-edit/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data+ {

                "username": username || ""
            }
            ),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error editing waiter:', error);
        throw error;
    }
}


export const adminCreateWaiter = async (data: any,username?: string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/admin-waiter-create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data+ {
                "username": username || ""
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error creating waiter:', error);
        throw error;
    }
}

export const adminResetWaiterBalances = async (username?: string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/admin-reset-waiter-balances/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "username": username || ""
            }),

        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error resetting waiter balances:', error);
        throw error;
    }
}


export const adminResetWaiterBalance = async (workerId:number,username?: string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/admin-reset-waiter-balances/${workerId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                "username": username || ""
            }),

        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error resetting waiter balances:', error);
        throw error;
    }
}


export const restaurantDataGet = async (restaurantUsername:string): Promise<ApiResponse<any>> => {
    try {
      

        const response = await fetch(`${API_BASE_URL}/get-restaurant-data/${restaurantUsername}/`, {
            method: 'GET',
            headers: {
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        throw error;
    }
}


export const getWorkerData = async (tip_slug: string): Promise<ApiResponse<any>> => {
    try {
     

        const response = await fetch(`${API_BASE_URL}/waiter/${tip_slug}/`, {
            method: 'GET',
            headers: {
                
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching worker data:', error);
        throw error;
    }
}



export const CreatePaymentLink = async (data: any): Promise<ApiResponse<any>> => {
    try {
       

        const response = await fetch(`${API_BASE_URL}/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
    }
}


export const CheckPaymentStatus = async (transactionId: string): Promise<ApiResponse<any>> => {
    try {
      
        const response = await fetch(`${API_BASE_URL}/payment-status/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
},
            body: JSON.stringify({ transaction: transactionId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error checking payment status:', error);
        throw error;
    }
}


export const WalletPayment = async (data: any): Promise<ApiResponse<any>> => {
    try {
        

        const response = await fetch(`${API_BASE_URL}/wallet-pay/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error processing wallet payment:', error);
        throw error;
    }
}


export const WalletPaymentStatus = async (transactionId: string,status:string): Promise<ApiResponse<any>> => {
    try {
        

        const response = await fetch(`${API_BASE_URL}/payment-status-check/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({ transaction: transactionId, status: status }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error checking wallet payment status:', error);
        throw error;
    }
}


export const getBankCards = async (): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/bank-cards/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching bank cards:', error);
        throw error;
    }
}



export const registerCard = async (waiter:string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/card-register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
               
                "language": "az",
                "description": `${waiter} üçün qeydiyyat`,
              }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error registering card:', error);
        throw error;
    }
}



export const withdrawMoney = async (data: any): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/withdrawal/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error withdrawing money:', error);
        throw error;
    }
}



export const superAdminGetTips = async (): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/tips/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching super admin tips:', error);
        throw error;
    }
}

export const superAdminGetWaiters = async (): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/waiters/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching super admin waiters:', error);
        throw error;
    }
}

export const superAdminEditWaiter = async (data: any): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/waiter-edit/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error editing super admin waiter:', error);
        throw error;
    }
}

export const superAdminCreateWaiter = async (data: any): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/waiter-create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error creating super admin waiter:', error);
        throw error;
    }
}


export const superAdminResetWaiterBalances = async (): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/reset-waiter-balances/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error resetting super admin waiter balances:', error);
        throw error;
    }
}


export const superAdminResetWaiterBalance = async (workerId:number): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/reset-waiter-balances/${workerId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error resetting super admin waiter balances:', error);
        throw error;
    }
}




export const superAdminExportTips = async (restaurantId?:string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/export-excel-tips/${restaurantId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error exporting super admin tips:', error);
        throw error;
    }
}


export const superAdminExportWaiters = async (restaurantId?:string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/export-excel-waiters/${restaurantId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error exporting super admin waiters:', error);
        throw error;
    }
}



export const superAdminRestaurants = async (): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/restaurants/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching super admin restaurants:', error);
        throw error;
    }
}



export const superAdminGetQRCodes = async (restaurantId?:string): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/get-qr-codes/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        console.error('Error fetching super admin QR codes:', error);
        throw error;
    }
}

export const superAdminEditQrCode = async (data: any): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/update-qr-code/${data.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error editing super admin QR code:', error);
        throw error;
    }
}


export const superAdminCreateQrCode = async (data: any): Promise<ApiResponse<any>> => {
    try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in localStorage');
        }

        const response = await fetch(`${API_BASE_URL}/super-admin/create-qr-code/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        return { data: responseData, success: true };
    } catch (error) {
        console.error('Error creating super admin QR code:', error);
        throw error;
    }
}