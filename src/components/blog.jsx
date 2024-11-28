import React, { useState, useEffect } from 'react';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    'https://dianaadvancedtechacademy.uk/wp-json/wp/v2/posts?_embed&per_page=3'
                );
                
                if (!response.ok) {                                              
                    throw new Error('Failed to fetch posts');
                }
                
                const data = await response.json();
                
                setPosts(data.map(post => {
                    // Trim description to exactly 20 words and add ellipsis
                    const descWords = post.excerpt.rendered.replace(/<\/?p>/g, '').split(' ');
                    const trimmedDesc = descWords.slice(0, 20).join(' ') + '.....';

                    return {
                        imgUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'fallback-image-url.jpg',
                        imgAlt: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || 'Blog post image',
                        title: post.title.rendered,
                        author: post._embedded?.author?.[0]?.name || 'Unknown Author',
                        date: new Date(post.date).toLocaleDateString(),
                        desc: trimmedDesc,
                        btnText: 'Read more',
                        commentCount: post.comment_count || '0',
                        link: post.link
                    };
                }));
                
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (isLoading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="blog-section padding-tb section-bg">
            <div className="container">
                <div className="section-header text-center">
                    <span className="subtitle">FROM OUR BLOG POSTS</span>
                    <h2 className="title">More Articles From Resource Library</h2>
                </div>
                <div className="section-wrapper">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 justify-content-center g-4">
                        {posts.map((post, i) => (
                            <div className="col" key={i}>
                                <div className="post-item">
                                    <div className="post-inner">
                                        <div className="post-thumb">
                                            <a href={post.link} target="_blank" rel="noopener noreferrer">
                                                <img src={post.imgUrl} alt={post.imgAlt} />
                                            </a>
                                        </div>
                                        <div className="post-content">
                                            <a href={post.link} target="_blank" rel="noopener noreferrer">
                                                <h4 dangerouslySetInnerHTML={{ __html: post.title }} />
                                            </a>
                                            <div className="meta-post">
                                                <ul className="lab-ul">
                                                    <li><i className="icofont-ui-user"></i>{post.author}</li>
                                                    <li><i className="icofont-calendar"></i>{post.date}</li>
                                                </ul>
                                            </div>
                                            <p dangerouslySetInnerHTML={{ __html: post.desc }} />
                                        </div>
                                        <div className="post-footer">
                                            <div className="pf-left">
                                                <a href={post.link} target="_blank" rel="noopener noreferrer" className="lab-btn-text">
                                                    {post.btnText} <i className="icofont-external-link"></i>
                                                </a>
                                            </div>
                                            <div className="pf-right">
                                                <i className="icofont-comment"></i>
                                                <span className="comment-count">{post.commentCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Blog;
