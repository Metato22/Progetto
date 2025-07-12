import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as React from "react";
import { Chip, Alert } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../auth/useAuth';
import '../styles/NewsCard.css';

export default function SecondNewsCard({ news }) {
    const isExternal = !news._id;
    const { user, isAuthenticated } = useAuth();
    const [showWarning, setShowWarning] = useState(false);
    const navigate = useNavigate();

    const linkTarget = isExternal ? news.url : `/news/${news._id}`;
    const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

    const handleClick = (e) => {
        if (news.accessLevel === 'premium' && (!isAuthenticated || user.planLevel === 'free')) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
            return;
        }

        if (isExternal) {
            // Comportamento identico a <a target="_blank" rel="noopener noreferrer">
            window.open(news.url, '_blank', 'noopener,noreferrer');
        } else {
            navigate(`/news/${news._id}`);
        }
    };

    return (
        <Card className="mb-3" style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'relative' }}>
            <Card.Img
                variant="top"
                src={news.image || news.imageUrl}
                style={{ height: '150px', objectFit: 'cover' }}
            />
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Card.Title style={{ fontSize: '1rem' }}>
                        {news.title}{' '}
                        {news.accessLevel === 'premium' && (
                            <Chip
                                label="Premium"
                                size="small"
                                color="warning"
                                style={{ marginLeft: '10px' }}
                            />
                        )}
                    </Card.Title>

                    <Chip
                        icon={isExternal ? <LanguageIcon /> : <ArticleIcon />}
                        label={isExternal ? 'Notizia esterna' : 'Notizia interna'}
                        color={isExternal ? 'default' : 'primary'}
                        variant="outlined"
                        size="small"
                    />
                </div>

                <p className="card-text">
                    {news.description + '...' || news.excerpt + '...' || ''}
                </p>

                <button className="btn-custom-dark" onClick={handleClick}>
                    Leggi tutto
                </button>

                <p className="card-text mt-2 mb-0">
                    <small className="text-muted">
                        Autore: {isExternal ? news.source?.name || 'Fonte esterna' : news.user?.fullName || 'Redazione'}
                    </small>
                </p>

                <p className="card-text">
                    <small className="text-body-secondary">
                        Ultima modifica:{' '}
                        {new Date(news.publishedAt || news.updatedAt).toLocaleString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </small>
                </p>

                {/* Avviso Premium */}
                {showWarning && (
                    <Alert
                        severity="warning"
                        className="premium-alert"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            borderRadius: 0,
                            zIndex: 10,
                        }}
                    >
                        Questa è una notizia premium. Per leggerla, passa al piano Premium.
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
}