import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, Observable, of, throwError } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FeedService } from './feed.service';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { Location } from '@angular/common';

export enum RoleEnum {
    Administrator = 'admin',
    User = 'user'
}

export interface TokenInfo {
    id: string;
    role?: RoleEnum[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    signInState$ = new BehaviorSubject<TokenInfo | null>(null);
    state;
    urlcheck;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private jwtSvc: JwtHelperService,
        private apiSvc: FeedService,
        private location: Location,
    ) {
        if (localStorage.getItem('access_token')) {
            this.trySetSignInState(localStorage.getItem('access_token'));
        }
    }

    trySetSignInState(token: string | null, returnUrl?: string) {
        if (token) {
            if (this.jwtSvc.isTokenExpired(token)) {
                this.trySetSignInState(null);
            } else {
                localStorage.setItem('access_token', token);
                const state = this.jwtSvc.decodeToken(token as string) as TokenInfo;
                this.state=state
                this.signInState$.next(state);
                if (returnUrl) {
                    this.router.navigateByUrl(returnUrl);
                }
                this.apiSvc.readLoginRoles().subscribe(e=>{
                    var role = e.find(s=>s.id == this.state.role_id )
                    if(role){
                        this.state.menus=role.menus
                        this.urlcheck = this.router.events
                            .pipe(
                            // 過濾 NavigationEnd 事件
                            filter(event => event instanceof NavigationEnd)
                            )
                            .subscribe((event: NavigationEnd) => {
                            // 取得當前路由的路徑
                           
                            const currentPath = event.url;
                            if(currentPath!='/'){
                                var auth = role.menus.find(x=>x.url==currentPath)
                                if(!auth){
                                    this.router.navigate(['/login']);
                                    this.signOut()
                                } 
                            }
                     });
                       
                    } 
                    
                })
                
            }
        } else {
            if (localStorage.getItem('access_token')) {
                localStorage.removeItem('access_token');
            }
            this.signInState$.next(null);
            this.router.navigate(['/login']);
        }
    }

    signIn(user: string, pass: string): Observable<{ token: string }> {
        const returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
        return this.apiSvc.loginGetToken(user, pass).pipe(
            map((t:any) => {
                if (t) {
                    this.trySetSignInState(t.token, returnUrl);
                }
                return t;
            }),
            catchError(err => {
                return throwError(err);
            }),
        );
        
    }

    signOut(): void {
        this.trySetSignInState(null);
        this.urlcheck.unsubscribe();
    }
    

}
