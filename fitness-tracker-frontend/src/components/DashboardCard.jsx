import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import PropTypes from "prop-types";

const DashboardCard = ({ title, path, content }) => {
    const navigate = useNavigate();

    return (
        <Card onClick={() => navigate(path)}>
            <CardContent>
                <Typography variant="h5" gutterBottom>{title}</Typography>
                <List dense>
                    {content.map((text, index) => (
                        <ListItem key={text}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    content: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default DashboardCard;