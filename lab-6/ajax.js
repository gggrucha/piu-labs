export class HttpError extends Error { //klasa sztucznie stworzona żeby łapać błedy 4xx/5xx których zwykły fetch() nie łapie
  constructor(status, statusText, message) {
    super(message);
    this.status = status;
    this.statusText = statusText;
    this.name = 'HttpError'; 
  }
}

export class Ajax {
  /* Ajax to wrapper dla wykonywania fetch(). Czyli teraz tworzy się instancje klasy Ajax i wywołuje na niej metody z Ajax (dzięki temu nie trzeba fetch() poza tą klasą używać)
  w konstruktorze są defaultowe options (m.in nagłówki i timeout) które są scalane z tymi które użytkownik podał przy wywoływaniu konstruktora
  Prócz tego są cztery metody które większością kodu się pokrywają, ale w dużym uproszczeniu w bloku try próbujemy wywołać fetch(), jak się nie uda to w catch jest cała logika błędów.
  Cztery rodzaje błędów: ten związany z timeout, dwa związane z errorami 4xx,5xx oraz jeden na dowolne błędy
  */
  
  constructor(options={}) { 

    const defaultHeaders = { 
        'Content-Type': 'application/json',
    };

    const finalHeaders = {
        ...defaultHeaders,
        ...(options.headers || {})
    };

    this.options = {
      'timeout': 5000,
      ...options, 
      headers: finalHeaders
    };
  }

  async get(url, options={}) {
    const finalOptions = {
        ...this.options, //te podane przy tworzeniu obiektu
        ...options, //te podane przy wywoływaniu get
        headers: {
        ...this.options.headers,
        ...(options.headers || {})
      }
    };

    let timeoutId = null;
    if (finalOptions.timeout) {
      const controller = new AbortController();
      finalOptions.signal = controller.signal;         
      timeoutId = setTimeout(() => {
      controller.abort();
      }, finalOptions.timeout);
    }

    try {
    // console.log('Próbuję wykonać response...')
    const response = await fetch(url, finalOptions)
    if (timeoutId) clearTimeout(timeoutId); //timeout stop
    if (!response.ok) {
      throw new HttpError(response.status, response.statusText, `Zapytanie zakończyło się błędem o statusie ${response.status}`)
    }
    // console.log('Działa')
    const data = await response.json();
    // console.log(data);
    return data;
    }

    catch (err) {
      if (timeoutId) clearTimeout(timeoutId); //timeout stop

      if (err.name === 'AbortError') {
          console.error(`Zapytanie przekroczyło czas oczekiwania (${finalOptions.timeout}ms)`);
          throw new Error('Request Timeout');
      }
      if (err.name=='HttpError' && err.status >=400 && err.status < 500) {  //if (err instanceof HttpError) nie dzialalo
        console.error(`Błąd HTTP ${err.status}: ${err.statusText}`);
      }
      else if (err.name=='HttpError' && err.status >= 500) {
        console.error(err.message)
      }
      else {
        console.error('Błąd sieciowy lub inny:', err);
      }
      throw err;
    }
   }

  async post(url, data, options={}) { 
    const finalOptions = {
      ...this.options,      
      ...options,
      method: 'POST',
      body: JSON.stringify(data), //obiekt JS -> JSON
      headers: {
      ...this.options.headers,
      ...(options.headers || {})
      }
   }
    let timeoutId = null;
    if (finalOptions.timeout) {
      const controller = new AbortController();
      finalOptions.signal = controller.signal;
      timeoutId = setTimeout(() => {
      controller.abort();
      }, finalOptions.timeout);
    }

    try {
      console.log('Próbuję wykonać response...post.')
      const response = await fetch(url, finalOptions)
      if (timeoutId) clearTimeout(timeoutId); //timeout stop
      
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText, `Zapytanie post zakończyło się błędem o statusie ${response.status}`)
      }
      // console.log('Działa')
      const data = await response.json();
      // console.log(data);

      // te same dane co wysłane
      const responseData = await response.json();
      console.log(responseData); 
      return responseData;
    }
    catch (err) {
      if (timeoutId) clearTimeout(timeoutId); //timoeut stop

      if (err.name === 'AbortError') {
        console.error(`Zapytanie przekroczyło czas oczekiwania (${finalOptions.timeout}ms)`);
        throw new Error('Request Timeout');
      }
      if (err.name === 'HttpError' && err.status >= 400 && err.status < 500) {
        console.error(`Błąd klienta w POST: ${err.status} - ${err.statusText}`);
      } 
      else if (err.name === 'HttpError' && err.status >= 500) {
        console.error(`Błąd serwera w POST: ${err.message}`);
      } 
      else {
        console.error('Błąd sieciowy lub inny:', err);
      }
      throw err;
    }
  }

  async put(url, data, options = {}) {
    const finalOptions = {
        ...this.options,
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            ...this.options.headers,
            ...(options.headers || {})
        }
    };

    let timeoutId = null;
    if (finalOptions.timeout) {
      const controller = new AbortController();
      finalOptions.signal = controller.signal; 
      timeoutId = setTimeout(() => {
      controller.abort();
      }, finalOptions.timeout);
    }

    try {
        // console.log('Próbuję wykonać PUT...');
        const response = await fetch(url, finalOptions);

        if (timeoutId) clearTimeout(timeoutId);
        if (!response.ok) {
            throw new HttpError(response.status, response.statusText, `Zapytanie PUT nie powiodło się: ${response.status}`);
        }

        // console.log('PUT udany');
        const responseData = await response.json();
        // console.log('Zaktualizowane dane:', responseData);
        return responseData;

    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
          console.error(`Zapytanie przekroczyło czas oczekiwania (${finalOptions.timeout}ms)`);
          throw new Error('Request Timeout');
      }

      if (err.name === 'HttpError' && err.status >= 400 && err.status < 500) {
        console.error(`Błąd klienta w PUT: ${err.status} - ${err.statusText}`);
      } 
      else if (err.name === 'HttpError' && err.status >= 500) {
        console.error(`Błąd serwera w PUT: ${err.message}`);
      } 
      else {
        console.error('Błąd sieciowy lub inny:', err);
      }
      throw err;
    }
  }

  async delete(url, options = {}) { //na jsonplaceholder tak naprawde sie nie skasuje tylko bedzie sfakeowane ze sie skasowalo
    const finalOptions = {
        ...this.options,
        ...options,
        method: 'DELETE',
        headers: {
            ...this.options.headers,
            ...(options.headers || {})
        }
    };

    let timeoutId = null;
    if (finalOptions.timeout) {
      const controller = new AbortController();
      finalOptions.signal = controller.signal; 
      timeoutId = setTimeout(() => {
      controller.abort();
      }, finalOptions.timeout);
    }

    try {
        // console.log('Próbuję wykonać DELETE...');
      const response = await fetch(url, finalOptions);
      if (timeoutId) clearTimeout(timeoutId);
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText, `Zapytanie DELETE nie powiodło się: ${response.status}`);
      }

      // console.log('DELETE udany');

        if (response.status === 204) {
            return null;
        }
        const responseData = await response.json();
        // console.log('Odpowiedź serwera:', responseData);
        return responseData;

    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
          console.error(`Zapytanie przekroczyło czas oczekiwania (${finalOptions.timeout}ms)`);
          throw new Error('Request Timeout');
      }
        if (err.name === 'HttpError' && err.status >= 400 && err.status < 500) {
            console.error(`Błąd klienta w DELETE: ${err.status} - ${err.statusText}`);
        } 
        else if (err.name === 'HttpError' && err.status >= 500) {
            console.error(`Błąd serwera w DELETE: ${err.message}`);
        } 
        else {
            console.error('Błąd sieciowy lub inny:', err);
        }
        throw err;
    }
  } 
}