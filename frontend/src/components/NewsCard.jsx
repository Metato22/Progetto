import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        if (data.accessLevel === 'premium' && (!isAuthenticated || user.planLevel === 'free')) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
            return;
        }

        if (isExternal) {
            window.open(data.url, '_blank');
        } else {
            navigate(`/news/${data._id}`);
        }
    };

    return (
        <div className="card1 mb-3 text-white">
            <div className="row g-0">
                <div className="col-md-4">
                    <img
                        src={data.image || data.imageUrl}
                        className="img-fluid rounded-start"
                        alt="immagine notizia"
                    />
                </div>
                <div className="col-md-8">
                    <div className="card1-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card1-title">
                                {data.title}{' '}
                                {data.accessLevel === 'premium' && (
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

                        <p className="card1-text">
                            {data.description + '...' || data.excerpt + '...' || ''}
                        </p>

                        <button
                            className="btn-custom-dark"
                            disabled={showWarning}
                            onClick={handleClick}
                        >
                            Leggi tutto
                        </button>

                        <p className="card1-text mt-2 mb-0">
                            <small className="text-muted">
                                Autore:{' '}
                                {isExternal
                                    ? data.source?.name || 'Fonte esterna'
                                    : data.user?.fullName || 'Redazione'}
                            </small>
                        </p>

                        <p className="card1-text mb-0">
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