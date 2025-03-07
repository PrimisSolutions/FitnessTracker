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

const DashboardCard = ({ title, path, content }) => {
    const navigate = useNavigate();

    return (
        <Card onClick={() => navigate(path)}>
            <CardContent>
                <Typography variant="h5" gutterBottom>{title}</Typography>
                <List dense>
                    {content.map((text, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default DashboardCard;