import Item from '../components/Item';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../styles/Contacts.css';

function Contacts() {
    return (
        <Item>
            <h1 className="title-contact">
                <ContactsIcon className="me-2" />
                Contatti
                <ContactsIcon className="ms-2" />
            </h1>
            <div className="contact-container">
                <div className="contact-card">
                    <PersonIcon fontSize="large" className="mb-2" />
                    <h1 className="fs-4">Matteo Di Maria</h1>
                    <p className="fs-6"><BadgeIcon className="me-2" />
                        <strong>Ruolo:</strong> Sviluppatore Backend</p>
                    <p className="fs-6">
                        <EmailIcon className="me-2" />
                        <strong>Email:</strong>{' '}
                        <a href="mailto:m.dimaria@studenti.poliba.it" className="text-white text-decoration-underline">
                            m.dimaria@studenti.poliba.it
                        </a>
                    </p>
                    <p className="fs-6"><LocationOnIcon className="me-2" />
                        <strong>Sede:</strong> Politecnico di Bari, Puglia
                    </p>
                </div>
                <div className="contact-card">
                    <PersonIcon fontSize="large" className="mb-2" />
                    <h1 className="fs-4">Antonio De Maso</h1>
                    <p className="fs-6"><BadgeIcon className="me-2" />
                        <strong>Ruolo:</strong> Sviluppatore Frontend
                    </p>
                    <p className="fs-6">
                        <EmailIcon className="me-2" />
                        <strong>Email:</strong>{' '}
                        <a href="mailto:a.demaso@studenti.poliba.it" className="text-white text-decoration-underline">
                            a.demaso@studenti.poliba.it
                        </a>
                    </p>
                    <p className="fs-6"><LocationOnIcon className="me-2" />
                        <strong>Sede:</strong> Politecnico di Bari, Puglia
                    </p>
                </div>
                <div className="contact-card">
                    <PersonIcon fontSize="large" className="mb-2" />
                    <h1 className="fs-4">Domenico Cacciapaglia</h1>
                    <p className="fs-6"><BadgeIcon className="me-2" />
                        <strong>Ruolo:</strong> Sviluppatore Backend
                    </p>
                    <p className="fs-6">
                        <EmailIcon className="me-2" />
                        <strong>Email:</strong>{' '}
                        <a href="mailto:d.cacciapaglia2@studenti.poliba.it" className="text-white text-decoration-underline">
                            d.cacciapaglia2@studenti.poliba.it
                        </a>
                    </p>
                    <p className="fs-6"><LocationOnIcon className="me-2" />
                        <strong>Sede:</strong> Politecnico di Bari, Puglia
                    </p>
                </div>
            </div>
        </Item>
    );
}

export default Contacts;