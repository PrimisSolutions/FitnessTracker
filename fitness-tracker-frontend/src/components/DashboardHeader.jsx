import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";

const DashboardHeader = ({ onLogout }) => {
    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            color="primary">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6">Fitness Tracker</Typography>
                <Button color="inherit" onClick={onLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
};

DashboardHeader.propTypes = {
    onLogout: PropTypes.func.isRequired
};

export default DashboardHeader;