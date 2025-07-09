import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as React from "react";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#424242',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function NewsCard({ news }) {
    return (
        <div className="card mb-3 " style={{ maxWidth: '2000px' }}>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={news.imageUrl} className="img-fluid rounded-start" alt="..."/>
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{news.title}</h5>
                        <p className="card-text">{news.excerpt}</p>
                        <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}