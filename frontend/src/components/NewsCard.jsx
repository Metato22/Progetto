import { Link } from 'react-router-dom';
import * as React from "react";
import '../styles/NewsCard.css';

export function NewsCard({ data }) {
    console.log(data);
    return (
        <div className="card mb-3 " style={{maxWidth: '2000px'}}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={data.urlToImage} className="img-fluid rounded-start" alt="..."/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{data.title}</h5>
                        <p className="card-text">{data.description}</p>
                        <Link to={data.url} className="btn-custom-dark">
                            Leggi tutto
                        </Link>
                        <p className="card-text">
                            <small className="text-body-secondary">
                                Ultima modifica: {new Date(data.publishedAt).toLocaleString('it-IT', {
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