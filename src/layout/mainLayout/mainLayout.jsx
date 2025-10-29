import {Outlet} from 'react-router'
import TheFooter from '@/Components/TheFooter/TheFooter';


function MainLayout() {
    return (
    <div>
        <main>
            <Outlet />
        </main>
        <TheFooter />
    </div>);
}

export default MainLayout;