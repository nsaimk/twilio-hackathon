import React, { useState, useEffect } from 'react';

const MainTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://twilio-hackathon-server.vercel.app/product');
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBuy = async (productId) => {
        try {
            const response = await fetch(`http://twilio-hackathon-server.vercel.app/product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log(`Product ${productId} marked as sold`);
                const updatedProducts = products.map(product =>
                    product.id === productId ? { ...product, available: false } : product
                );
                setProducts(updatedProducts);
            } else {
                console.error('Error updating product availability');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '140px' }}>
            <h2>Product List</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} style={{ textAlign: 'center' }}>
                            <td>{product.id + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.price}£</td>
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    style={{
                                        backgroundColor: '#32CD32',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        borderRadius: '5px',
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                    onClick={() => handleBuy(product.id)}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#32CD32'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
                                    disabled={!product.available} 
                                >
                                    {product.available ? 'BUY' : 'SOLD OUT'}
                                </button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MainTable;
