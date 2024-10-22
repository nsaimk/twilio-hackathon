import React, { useState, useEffect } from 'react';

const MainTable = () => {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/product');
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '140px' }}>
            <h2>Product List</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id+1}</td>
                            <td>{product.name}</td>
                            <td>{product.price}£</td>
                            <td>{product.available}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MainTable;
