import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { StoreSignup } from './Components/store-signup/store-signup';
import { Dashboard } from './Components/dashboard/dashboard';
import { Terminal } from './Components/terminal/terminal';
import { MemberSignup } from './Components/member-signup/member-signup';
import { UpdatePassword } from './Components/update-password/update-password';
import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'signup',
        component: StoreSignup
    },
    {
        path: 'dashboard/:store_id',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'terminal',
        component: Terminal,
        canActivate: [authGuard]
    },
    {
        path: 'member-signup',
        component: MemberSignup,
        canActivate: [authGuard]
    },
    {
        path: 'update-password',
        component: UpdatePassword
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

