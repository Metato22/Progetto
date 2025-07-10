import { Link } from 'react-router-dom';
import * as React from "react";
import '../styles/NewsCard.css';

export function NewsCard({news}) {
    return (
        <div className="card mb-3 " style={{maxWidth: '2000px'}}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={news.imageUrl} className="img-fluid rounded-start" alt="..."/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{news.title}</h5>
                        <p className="card-text">{news.excerpt}</p>
                        <Link to={`/news/${news._id}`} className="btn-custom-dark">
                            Leggi tutto
                        </Link>
                        <p className="card-text">
                            <small className="text-body-secondary">
                                Ultima modifica: {new Date(news.updatedAt).toLocaleString('it-IT', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}