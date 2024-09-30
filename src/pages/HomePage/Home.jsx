import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';

const Home = () => {
    const [comments, setComments] = useState([]);

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/comments');
                setComments(response.data.slice(0, 100)); // Lấy 100 bài comment đầu tiên
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, []);

    const Row = ({ index, style }) => {
        console.log(`Rendering comment ${index + 1}: ${comments[index].name}`);
        return (
            <div style={style}>
                <strong>{comments[index].name}</strong>: {comments[index].body}
            </div>
        );
    };

    return (
        <div className="bg-red-200 max-h-screen">
            <List
                height={600}
                itemCount={comments.length}
                itemSize={50}
                width={600} // Chiều rộng của vùng hiển thị
            >
                {Row}
            </List>
        </div>
    );
};

export default Home;
