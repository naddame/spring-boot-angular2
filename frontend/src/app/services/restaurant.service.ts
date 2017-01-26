import {Order}      from './order';
import {Injectable} from '@angular/core';
import {Router}     from '@angular/router';
import {Http, Headers}       from '@angular/http';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class RestaurantService {

  //private ordersUrl = location.protocol+'//'+location.hostname+(location.port?":"+location.port:"") + '/api/orders';
  private ordersUrl = location.protocol+'//'+location.hostname+':8080/api/orders';
  public constructor(private router: Router, private http: Http) {}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getOrders(): Promise<Order[]> {
    return this.http.get(this.ordersUrl, {headers: this.prepareHeaders()}).toPromise().then(response => {
      console.log("getOrders", response.json());
      return response.json().content as Order[]}).catch(this.handleError);
  }

  saveOrder(_order) {
    const url = `${this.ordersUrl}/${_order.id}`;
    return this.http
      .put(url, JSON.stringify(_order), {headers: this.prepareHeaders()})
      .toPromise()
      .then(() => _order)
      .catch(this.handleError);

  }


  newOrder() {
    let _order = new Order(1);
    return this.http
      .post(this.ordersUrl, JSON.stringify(_order), {headers: this.prepareHeaders()})
      .toPromise()
      .then(res => {_order = res.json(); this.router.navigate( ['order', _order.id]); })
      .catch(this.handleError);
  }

  getOrderById(orderId) {
    console.log("getOrderById", orderId);
    const url = `${this.ordersUrl}/${orderId}`;
    return this.http.get(url, {headers: this.prepareHeaders()})
      .toPromise()
      .then(response => response.json() as Order)
      .catch(this.handleError);
  }

  checkout(_order) {
    _order.closed = new Date();
    _order.paid   = true;
    return this.saveOrder(_order);
  }

  prepareHeaders(){
    return new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer '+localStorage.getItem('jwt')
    });
  }
}
