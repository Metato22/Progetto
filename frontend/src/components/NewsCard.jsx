import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import LanguageIcon from '@mui/icons-material/Language';
import { Chip, Alert } from '@mui/material';
import { useAuth } from '../auth/useAuth';
import '../styles/NewsCard.css';

export function NewsCard({ data }) {
    const isExternal = !data._id;
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [showWarning, setShowWarning] = useState(false);

    const handleClick = (e) => {
        if (data.isPremium && (!isAuthenticated || user.level === 'free')) {
            e.preventDefault(); // blocca navigazione
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000); // nascondi dopo 3s
        }
    };

    return (
        <div className="card mb-3 position-relative">
            <div className="row g-0">
                <div className="col-md-4">
                    <img
                        src={data.image || data.imageUrl}
                        className="img-fluid rounded-start"
                        alt="immagine notizia"
                    />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card-title">
                                {data.title}{' '}
                                {data.isPremium && (
                                    <Chip
                                        label="Premium"
                                        size="small"
                                        color="warning"
                                        style={{ marginLeft: '10px' }}
                                    />
                                )}
                            </h5>

                            <Chip
                                icon={isExternal ? <LanguageIcon /> : <ArticleIcon />}
                                label={isExternal ? 'Notizia esterna' : 'Notizia interna'}
                                color={isExternal ? 'default' : 'primary'}
                                variant="outlined"
                                size="small"
                            />
                        </div>

                        <p className="card-text">
                            {data.description + '...' || data.excerpt + '...' || ''}
                        </p>

                        <Link
                            to={isExternal ? data.url : `/news/${data._id}`}
                            className="btn-custom-dark"
                            target={isExternal ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            onClick={handleClick}
                        >
                            Leggi tutto
                        </Link>

                        <p className="card-text mt-2 mb-0">
                            <small className="text-muted">
                                Autore:{' '}
                                {isExternal
                                    ? data.source?.name || 'Fonte esterna'
                                    : data.user?.fullName || 'Redazione'}
                            </small>
                        </p>

                        <p className="card-text mb-0">
                            <small className="text-body-secondary">
                                Ultima modifica:{' '}
                                {new Date(
                                    data.publishedAt || data.updatedAt
                                ).toLocaleString('it-IT', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </small>
                        </p>
                    </div>
                </div>
            </div>

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
                        zIndex: 10,
                        borderRadius: 0,
                    }}
                >
                    Questa è una notizia premium. Per leggerla, passa al piano Premium.
                </Alert>
            )}
        </div>
    );
}