import templateQueryParameters from "./queryParams";
import jwt_decode from "jwt-decode";

const SIGN_IN_QUERY = "users/sign_in";
const UPDATE_PASSWORD_QUERY = "users/update_password";
const GET_WORKSHOP_ID = "workshop";
//export const getToken = () => localStorage.getItem('userToken')
export const getToken = () => {
  const jwt = sessionStorage.getItem("userToken");
  const jwtdecode = jwt_decode(jwt);

  const { exp } = jwtdecode;
  const datainseconds = new Date().getTime() / 1000;
  if (exp < datainseconds) {
    logic.logout();
    window.location.href = "/";
  } else {
    return sessionStorage.getItem("userToken");
  }
};
const logic = {
  _userId: sessionStorage.getItem("userData") || null,
  _currentPassword: null,
  _token: sessionStorage.getItem("userToken") || null,
  _companyId: sessionStorage.getItem("userCompany") || null,
  _loggedIn: !!sessionStorage.getItem("userToken") || false,

  _queryParameterString: "",
  _searchQueryString: "",

  URL: `${
    window.location.hostname === "localhost.localdomain"
      ? "http://0.0.0.0:3000/api/"
      : process.env.REACT_APP_API_URL
  }`,
  APP_URL: process.env.REACT_APP,

  get companyId() {
    return JSON.parse(this._companyId);
  },

  get userId() {
    return JSON.parse(this._userId);
  },

  get token() {
    return this._token;
  },
  getQueryParametersString() {
    return this._queryParameterString;
  },
  get loggedIn() {
    return this._loggedIn;
  },
  /**
   *
   * @param {String} path Path given to the api
   * @param {String} method METHOD given
   *
   * @returns {Promise} Fetch to API
   */

  get sessionId() {
    return JSON.parse(this._userId);
  },
  /**
   *
   * @returns {Promise} Fetch to API
   *
   */
  login(loginEmail, loginPassword) {
    const email = loginEmail;
    const password = loginPassword;

    this._currentPassword = password;

    if (typeof email !== "string")
      throw TypeError(`email: ${email} is not a string`);
    if (typeof password !== "string")
      throw TypeError(`password: ${password} is not a string`);

    if (!email.trim()) throw Error("email is empty or blank");
    if (!password.trim()) throw Error("password is empty or blank");

    return fetch(`${this.URL}/${SIGN_IN_QUERY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        user: {
          email,
          password,
        },
      }),
    })
      .then((res) => {
        this._token = res && res.headers && res.headers.get("Authorization");
        sessionStorage.setItem(
          "userToken",
          res && res.headers && res.headers.get("Authorization")
        );
        return res.json();
      })
      .then((res) => {
        if (res.error) throw Error(res.error);
        const { user } = res;
        if (user.need_change_password) {
          this._userId = JSON.stringify(user);
          this._companyId = JSON.stringify(user.company);
          sessionStorage.setItem(
            "userCompany",
            user && JSON.stringify(user.company)
          );
          sessionStorage.setItem("userData", JSON.stringify(user));
          this._loggedIn = true;
        } else {
          return this.getWorkshopId(user.id).then((res) => {
            if (res.user && res.user.workshop) {
              sessionStorage.setItem(
                "workshopId",
                JSON.stringify(res.user.workshop.id)
              );
              sessionStorage.setItem(
                "workshopLock",
                JSON.stringify(res.user.workshop.company_autounlock_intervention)
              );
              this._userId = JSON.stringify(user);
              this._companyId = JSON.stringify(user.company);
              sessionStorage.setItem(
                "userCompany",
                user && JSON.stringify(user.company)
              );
              sessionStorage.setItem("userData", JSON.stringify(user));
              this._loggedIn = true;
            } else {
              throw Error(" user not authorized to login");
            }
          });
        }
      });
    /* .then(res => {
        console.log('user2', res.user)
        const { user } = res;
        // if (!user.person.company_client)
        //   throw Error(" not authorized to login");
        if (res.error) throw Error(res.error);
        this._userId = JSON.stringify(user);
        this._companyId = JSON.stringify(user.company);
        sessionStorage.setItem(
          "userCompany",
          user && JSON.stringify(user.company)
        );
        sessionStorage.setItem("userData", JSON.stringify(user));
        this._loggedIn = true;
      }); */
  },

  getWorkshopId(userId) {
    const headers = {
      Authorization: getToken(),
    };

    return fetch(`${this.URL}/users/${userId}/${GET_WORKSHOP_ID}`, {
      method: "GET",
      headers,
    }).then((res) => {
      return res.json();
    });
  },

  logout() {
    this._userId = null;
    this._token = null;
    this._companyId = null;

    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userCompany");
    sessionStorage.removeItem("workshopId");
    sessionStorage.removeItem("currentVehicleId");
    sessionStorage.removeItem("currentVehicleData");
    sessionStorage.removeItem("workshopData");
    this._loggedIn = false;
  },
  /**
   *
   * @param {string} newNetworkName to change to
   * @param {Object} network network to change name to
   *
   * @throws {Error} if NewNetworkName is non-string or empty
   *
   * @throws {Error} if network is a non-object
   *
   * @throws {Error} if network id inside object is a non-integer
   */
  updatePassword(passwordData) {
    const { currentPassword, newPassword, checkNewPassword } = passwordData;

    const method = "PATCH";
    const body = {
      user: {
        password: newPassword,
        password_confirmation: checkNewPassword,
        current_password: currentPassword,
      },
    };
    return logic._call(`${UPDATE_PASSWORD_QUERY}`, method, body);
  },

  // generic call function for all of the API requests
  _call(path, method, body, isFile = false) {
    let queryString = "";
    if (method === "GET") {
      queryString = this._searchQueryString + this._queryParameterString;
    }

    let theBody = body;

    const headers = {
      Authorization: getToken(),
    };

    if (!isFile) {
      headers["Content-Type"] = "application/json; charset=utf-8";
      theBody = JSON.stringify(body);
    }

    return fetch(`${this.URL}/${path}/?${queryString}`, {
      method: method,
      headers,
      body: theBody,
    })
      .then((res) => {
        // console.log("res LOGIC ------------ :", res);
        if (res.ok) {
          if (res.status === 200 || res.status === 201) {
            return res.json().then((json) => ({
              total: res.headers.get("total"),
              status: res.status,
              json,
            }));
          } else {
            return {
              response: "Response returned no content",
              status: res.status,
            };
          }
        } else {
          return res.json().then((json) => {
            return Promise.reject(json);
          });
        }
      })
      .catch((err) => {
        let errorMessage;
        if (err && err.message) {
          errorMessage = err.message;
        }
        if (err && err.error) {
          errorMessage = err.error;
        }
        if (err && err.errors) {
          const errorArray = Object.values(err.errors);
          errorMessage = errorArray.join(" ");
        }
        if (errorMessage === "Failed to Login") {
          this._loggedIn = false;
        }
        console.log(
          `Error ${errorMessage} in ${method} request made to:${this.URL}/${path}/?${queryString}`
        );
        return Promise.reject({
          status: "error",
          message: errorMessage,
        });
        //throw Error(errorMessage)
      });
  },
  configureSearchQueryString(params) {
    let searchQueryString = "";
    for (const param in params) {
      if (param && params[param] && templateQueryParameters[param]) {
        searchQueryString +=
          templateQueryParameters[param] + params[param] + "&";
      }
    }
    return searchQueryString;
  },

  configureDefaultQueryParametersString(params) {
    const {
      companyIdStartString,
      sortStartString,
      sortingByDate,
      sortingPage,
      sortingPerPage,
      sortByAscDesc,
    } = templateQueryParameters;

    // params.companyId ? null : params.companyId = logic.getFilter("company_id")
    // params.currentPage ? null : params.currentPage = 1
    // params.perPage ? null : params.perPage = 25
    const base = {};

    base.companyId =
      (params && params.companyId) ||
      (this.companyId && this.companyId.id) ||
      "";
    base.currentPage = (params && params.currentPage) || 1;
    base.perPage = (params && params.perPage) || 9999;

    // concats the query string
    return (
      companyIdStartString +
      "=" +
      base.companyId +
      "&" +
      sortStartString +
      "=" +
      sortingByDate +
      sortByAscDesc +
      "&" +
      sortingPage +
      base.currentPage +
      "&" +
      sortingPerPage +
      base.perPage
    );
  },

  configureAndSetDefaultQueryParametersString(params) {
    return (this._queryParameterString = this.configureDefaultQueryParametersString(
      params
    ));
  },

  // function that puts together the query params that the _call function will excecute.
  configureQueryParameters(params) {
    // If a refresh was called, then what we do is keep the old configuration
    if (params.refresh) {
      return;
    }

    if (params.clear) {
      this._searchQueryString = "";
      return;
    }

    // setting base values
    if (!params) {
      params = {};
    }

    // distinguishes if the request that is comming in is a pagination request, in that case, it will only configure the pagination configuration and return.
    if (params.pagination) {
      return (this._queryParameterString = this.configureDefaultQueryParametersString(
        params
      ));
    }

    // configure search parameters separately. If there are none, returns an empty string
    let searchQueryString = "";
    searchQueryString += this.configureSearchQueryString(params);

    // NOTE: should we always add the default params?
    //if (!this.getQueryParametersString()) searchQueryString += this.configureDefaultQueryParametersString()
    this.configureAndSetDefaultQueryParametersString();

    return (this._searchQueryString = searchQueryString);
  },
};
export default logic;
