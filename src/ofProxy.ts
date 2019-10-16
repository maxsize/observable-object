import { Subject, Observable } from 'rxjs';

interface PropertyChange {
  oldValue: any;
  newValue: any;
  key: string | number | symbol;
}

/**
 * ofProxy creates a proxy and observable to watch the property changes of the given target.
 */
function ofProxy<T extends object>(target: T): [T, Observable<PropertyChange>] {
  const subject = new Subject<PropertyChange>();
  const proxy = new Proxy<T>(target, {
    set(target, key, newValue) {
      const oldValue = target[key];
      target[key] = newValue;
      subject.next({
        oldValue,
        newValue,
        key
      });
      return true;
    },
    get(target, key) {
      return target[key];
    }
  });
  return [proxy, subject.asObservable()];
}

export { ofProxy, PropertyChange };
