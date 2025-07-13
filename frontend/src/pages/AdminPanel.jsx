import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Container, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import Item from '../components/Item';
import { useCategories } from '../context/CategoriesContext';
import '../styles/AdminPage.css'

const regions = ['Italia', 'Mondo'];
const gnewsCategories = [
    'general', 'world', 'nation', 'business',
    'technology', 'entertainment', 'sports', 'science', 'health',
];

export default function AdminPanel() {
    const { categories, fetchCategories } = useCategories(); // categorie da context
    const [news, setNews] = useState([]);
    const [message, setMessage] = useState('');

    const [editingCategory, setEditingCategory] = useState(null);
    const [editingNews, setEditingNews] = useState(null);

    const [categoryModalShow, setCategoryModalShow] = useState(false);
    const [newsModalShow, setNewsModalShow] = useState(false);

    const [formCategory, setFormCategory] = useState({
        name: '',
        description: '',
        gnewsCategory: 'general',
    });

    const [formNews, setFormNews] = useState({
        title: '',
        content: '',
        imageUrl: '',
        accessLevel: 'free',
        category: '',
        region: 'Mondo',
    });

    // fetch news (rimane locale)
    const fetchNews = async () => {
        try {
            const newsData = await axios.get('/news');
            setNews(newsData.data);
        } catch (err) {
            console.error('Errore fetchNews:', err);
            setMessage('Errore caricamento notizie');
        }
    };

    // inizializza categories (dal context) e news (locale)
    useEffect(() => {
        fetchCategories();
        fetchNews();
    }, []);

    // crea o aggiorna categoria tramite API e aggiorna context
    const createOrUpdateCategory = async () => {
        try {
            if (editingCategory) {
                await axios.put(`/categories/${editingCategory._id}`, formCategory);
                setMessage('Categoria aggiornata');
            } else {
                await axios.post('/categories', formCategory);
                setMessage('Categoria creata');
            }
            setFormCategory({ name: '', description: '', gnewsCategory: 'general' });
            setEditingCategory(null);
            setCategoryModalShow(false);
            fetchCategories();
        } catch (err) {
            setMessage('Errore con la categoria: ' + (err.response?.data?.message || err.message));
        }
    };

    // elimina categoria e aggiorna context
    const deleteCategory = async (id) => {
        try {
            await axios.delete(`/categories/${id}`);
            fetchCategories();
        } catch {
            setMessage('Errore eliminazione categoria');
        }
    };

    // crea o aggiorna notizia localmente
    const createOrUpdateNews = async () => {
        try {
            if (editingNews) {
                await axios.put(`/news/${editingNews._id}`, formNews);
            } else {
                await axios.post('/news', formNews);
            }
            setFormNews({
                title: '',
                content: '',
                imageUrl: '',
                accessLevel: 'free',
                category: '',
                region: 'Mondo',
            });
            setNewsModalShow(false);
            setEditingNews(null);
            fetchNews();
        } catch(err) {
            const errMsg = err.response?.data?.message || err.message || 'Errore salvataggio notizia';
            alert(errMsg);
        }
    };

    // elimina notizia e aggiorna stato locale
    const deleteNews = async (id) => {
        try {
            await axios.delete(`/news/${id}`);
            fetchNews();
        } catch {
            setMessage('Errore eliminazione notizia');
        }
    };

    // apre modale modifica categoria
    const openEditCategory = (cat) => {
        setFormCategory({
            name: cat.name,
            description: cat.description,
            gnewsCategory: cat.gnewsCategory || 'general',
        });
        setEditingCategory(cat);
        setCategoryModalShow(true);
    };

    // apre modale modifica notizia
    const openEditNews = (item) => {
        setFormNews({
            title: item.title,
            content: item.content || '',
            imageUrl: item.imageUrl || '',
            accessLevel: item.accessLevel,
            category: item.category?._id || '',
            region: item.region || 'Mondo',
        });
        setEditingNews(item);
        setNewsModalShow(true);
    };

    return (
        <Container>
            <Item>
                <h2 className="admin-title">Admin Panel</h2>

                <div className="d-flex justify-content-between align-items-center mt-4">
                    <h4 className="text-white">Categorie</h4>
                    <Button onClick={() => {
                        setEditingCategory(null);
                        setFormCategory({ name: '', description: '', gnewsCategory: 'general' });
                        setCategoryModalShow(true);
                    }}>
                        Aggiungi Categoria
                    </Button>
                </div>

                <Table striped bordered className="mt-3">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrizione</th>
                        <th>GNews</th>
                        <th>Azioni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((c) => (
                        <tr key={c._id}>
                            <td>{c.name}</td>
                            <td>{c.description}</td>
                            <td>{c.gnewsCategory}</td>
                            <td>
                                <Button size="sm" className="me-2" onClick={() => openEditCategory(c)}>Modifica</Button>
                                <Button size="sm" variant="danger" onClick={() => deleteCategory(c._id)}>Elimina</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                {message && <Alert className="mt-3">{message}</Alert>}

                <hr />

                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="text-white">Notizie</h4>
                    <Button onClick={() => {
                        setEditingNews(null);
                        setFormNews({
                            title: '',
                            content: '',
                            imageUrl: '',
                            accessLevel: 'free',
                            category: '',
                            region: 'Mondo',
                        });
                        setNewsModalShow(true);
                    }}>
                        Aggiungi Notizia
                    </Button>
                </div>

                <Table striped bordered className="mt-3">
                    <thead>
                    <tr>
                        <th>Titolo</th>
                        <th>Categoria</th>
                        <th>Regione</th>
                        <th>Accesso</th>
                        <th>Likes</th>
                        <th>Dislikes</th>
                        <th>Azioni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {news.map((n) => (
                        <tr key={n._id}>
                            <td>{n.title}</td>
                            <td>{n.category?.name || '-'}</td>
                            <td>{n.region}</td>
                            <td>{n.accessLevel}</td>
                            <td>{n.likes}</td>
                            <td>{n.dislikes}</td>
                            <td>
                                <Button size="sm" className="me-2" onClick={() => openEditNews(n)}>Modifica</Button>
                                <Button size="sm" variant="danger" onClick={() => deleteNews(n._id)}>Elimina</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                {/* MODAL: Categoria */}
                <Modal show={categoryModalShow} onHide={() => setCategoryModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingCategory ? 'Modifica' : 'Nuova'} Categoria</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Nome</Form.Label>
                                <Form.Control
                                    value={formCategory.name}
                                    onChange={(e) => setFormCategory(f => ({ ...f, name: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Descrizione</Form.Label>
                                <Form.Control
                                    value={formCategory.description}
                                    onChange={(e) => setFormCategory(f => ({ ...f, description: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Categoria GNews</Form.Label>
                                <Form.Select
                                    value={formCategory.gnewsCategory}
                                    onChange={(e) => setFormCategory(f => ({ ...f, gnewsCategory: e.target.value }))}
                                >
                                    {gnewsCategories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Button className="mt-3" onClick={createOrUpdateCategory}>
                                Salva
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* MODAL: Notizia */}
                <Modal show={newsModalShow} onHide={() => setNewsModalShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingNews ? 'Modifica' : 'Nuova'} Notizia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Titolo</Form.Label>
                                <Form.Control
                                    value={formNews.title}
                                    onChange={(e) => setFormNews(f => ({ ...f, title: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Contenuto</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={formNews.content}
                                    onChange={(e) => setFormNews(f => ({ ...f, content: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Immagine URL</Form.Label>
                                <Form.Control
                                    value={formNews.imageUrl}
                                    onChange={(e) => setFormNews(f => ({ ...f, imageUrl: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Access Level</Form.Label>
                                <Form.Select
                                    value={formNews.accessLevel}
                                    onChange={(e) => setFormNews(f => ({ ...f, accessLevel: e.target.value }))}
                                >
                                    <option value="free">Free</option>
                                    <option value="premium">Premium</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Categoria</Form.Label>
                                <Form.Select
                                    value={formNews.category}
                                    onChange={(e) => setFormNews(f => ({ ...f, category: e.target.value }))}
                                >
                                    <option value="">-- Seleziona Categoria --</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label className="text-dark">Regione</Form.Label>
                                <Form.Select
                                    value={formNews.region}
                                    onChange={(e) => setFormNews(f => ({ ...f, region: e.target.value }))}
                                >
                                    {regions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Button className="mt-3" onClick={createOrUpdateNews}>
                                Salva
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Item>
        </Container>
    );
}