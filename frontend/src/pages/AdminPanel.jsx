import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Container, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import Item from '../components/Item';

const regions = ['Italia', 'Mondo'];
const gnewsCategories = [
    'general', 'world', 'nation', 'business',
    'technology', 'entertainment', 'sports', 'science', 'health',
];

export default function AdminPanel() {
    const [categories, setCategories] = useState([]);
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

    const fetchAll = async () => {
        const [cats, newsData] = await Promise.all([
            axios.get('/categories'),
            axios.get('/news'),
        ]);
        setCategories(cats.data);
        setNews(newsData.data);
    };

    useEffect(() => {
        fetchAll();
    }, []);

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
            fetchAll();
        } catch (err) {
            setMessage('Errore con la categoria: ' + (err.response?.data?.message || err.message));
        }
    };

    const deleteCategory = async (id) => {
        await axios.delete(`/categories/${id}`);
        fetchAll();
    };

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
            fetchAll();
        } catch {
            alert('Errore salvataggio notizia');
        }
    };

    const deleteNews = async (id) => {
        await axios.delete(`/news/${id}`);
        fetchAll();
    };

    const openEditCategory = (cat) => {
        setFormCategory({
            name: cat.name,
            description: cat.description,
            gnewsCategory: cat.gnewsCategory || 'general',
        });
        setEditingCategory(cat);
        setCategoryModalShow(true);
    };

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
                <h2 className="mb-4">Admin Panel</h2>

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
                                <Form.Label className="text-dark">Accesso</Form.Label>
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
                                    <option value="">-- seleziona --</option>
                                    {categories.map((c) => (
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
                                    <option value="">-- seleziona regione --</option>
                                    {regions.map((r) => (
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