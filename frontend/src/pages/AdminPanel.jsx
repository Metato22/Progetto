import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Container, Form, Button, Alert, Table, Modal } from 'react-bootstrap';

const regions = ['Italia', 'Mondo'];

export default function AdminPanel() {
    const [categories, setCategories] = useState([]);
    const [news, setNews] = useState([]);
    const [form, setForm] = useState({ name: '', description: '' });
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingNews, setEditingNews] = useState(null);
    const [message, setMessage] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const [newsForm, setNewsForm] = useState({
        title: '',
        content: '',
        imageUrl: '',
        accessLevel: 'free',
        category: '',
        region: 'Mondo',  // default
    });

    const fetchAll = async () => {
        const [cats, newsData] = await Promise.all([
            axios.get('/categories'),
            axios.get('/news')
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
                await axios.put(`/categories/${editingCategory._id}`, form);
                setMessage('Categoria aggiornata');
            } else {
                await axios.post('/categories', form);
                setMessage('Categoria creata');
            }
            setForm({ name: '', description: '' });
            setEditingCategory(null);
            fetchAll();
        } catch(err) {
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
                await axios.put(`/news/${editingNews._id}`, newsForm);
            } else {
                await axios.post('/news', newsForm);
            }
            setNewsForm({
                title: '',
                content: '',
                imageUrl: '',
                accessLevel: 'free',
                category: '',
                region: 'Mondo',
            });
            setModalShow(false);
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
        setForm({ name: cat.name, description: cat.description });
        setEditingCategory(cat);
    };

    const openEditNews = (item) => {
        setNewsForm({
            title: item.title,
            content: item.content || '',
            imageUrl: item.imageUrl || '',
            accessLevel: item.accessLevel,
            category: item.category?._id || '',
            region: item.region || 'Mondo'
        });
        setEditingNews(item);
        setModalShow(true);
    };

    return (
        <Container>
            <h2 className="mb-4">Admin Panel</h2>

            <h4 className="mt-4">Categorie</h4>
            <ul>
                {categories.map(c => (
                    <li key={c._id} className="d-flex justify-content-between align-items-center">
                        {c.name}
                        <div>
                            <Button size="sm" className="me-2" onClick={() => openEditCategory(c)}>Modifica</Button>
                            <Button size="sm" variant="danger" onClick={() => deleteCategory(c._id)}>Elimina</Button>
                        </div>
                    </li>
                ))}
            </ul>

            <Form className="my-4">
                <Form.Group className="mb-2">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Descrizione</Form.Label>
                    <Form.Control value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </Form.Group>
                <Button onClick={createOrUpdateCategory}>{editingCategory ? 'Aggiorna' : 'Crea'} categoria</Button>
            </Form>

            {message && <Alert>{message}</Alert>}

            <hr />

            <div className="d-flex justify-content-between align-items-center">
                <h4>Notizie</h4>
                <Button onClick={() => { setEditingNews(null); setModalShow(true); }}>Aggiungi Notizia</Button>
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
                {news.map(n => (
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

            <Modal show={modalShow} onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingNews ? 'Modifica' : 'Nuova'} Notizia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control
                                value={newsForm.title}
                                onChange={e => setNewsForm(f => ({ ...f, title: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Contenuto</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={newsForm.content}
                                onChange={e => setNewsForm(f => ({ ...f, content: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Immagine URL</Form.Label>
                            <Form.Control
                                value={newsForm.imageUrl}
                                onChange={e => setNewsForm(f => ({ ...f, imageUrl: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Accesso</Form.Label>
                            <Form.Select
                                value={newsForm.accessLevel}
                                onChange={e => setNewsForm(f => ({ ...f, accessLevel: e.target.value }))}
                            >
                                <option value="free">Free</option>
                                <option value="premium">Premium</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select
                                value={newsForm.category}
                                onChange={e => setNewsForm(f => ({ ...f, category: e.target.value }))}
                            >
                                <option value="">-- seleziona --</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Regione</Form.Label>
                            <Form.Select
                                value={newsForm.region}
                                onChange={e => setNewsForm(f => ({ ...f, region: e.target.value }))}
                            >
                                <option value="">-- seleziona regione --</option>
                                {regions.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button onClick={createOrUpdateNews} className="mt-3">Salva</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}