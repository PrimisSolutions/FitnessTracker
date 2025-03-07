import React from 'react';
import PropTypes from 'prop-types';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar
} from '@mui/material';

const DRAWER_WIDTH = 240;

const DashboardSidebar = ({ menuItems, onNavigate }) => {
    return (
        <Drawer
            variant="permanent"
            sx={(theme) => ({
                width: DRAWER_WIDTH,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.secondary.main
                }
            })}
            >
                <Toolbar /> {/* Spacer */}
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton onClick={() => onNavigate(item.path)}>
                                <ListItemText primary={item.text} 
                                sx={{ color: (theme) => theme.palette.secondary.contrastText}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
    );
};

DashboardSidebar.propTypes = {
    menuItems: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired
        })
    ).isRequired,
    onNavigate: PropTypes.func.isRequired
};

export default DashboardSidebar;