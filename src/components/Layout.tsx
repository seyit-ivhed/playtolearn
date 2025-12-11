import React from 'react';
import { Outlet } from 'react-router-dom';
import SettingsMenu from './SettingsMenu';

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            <SettingsMenu />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
