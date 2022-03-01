import React from "react";
import "./App.css";
import Login from "./components/login";
import { StateProvider } from "./data/context/store";
import { initialState, mainReducer } from "./data/context/reducers/mainReducer";
import logic from "./logic/logic";
import { Route, withRouter, Redirect, Switch } from "react-router-dom";
import AppContainer from "./AppContainer";
import LoginContainer from "./LoginContainer";
import PrivateRoute from "./components/privateRoute";
// import PasswordChangePopUp from "./components/home/change_password/password_change_popup";
// así restableceríamos el popup + modificando sidebar.json ! ! !
import HomeComponent from "./components/home/home.cmp";
import PhonesComponent from "./components/home/phones/phone_page.cmp";
import AlarmsComponent from "./components/home/alarms/alarms_page.cmp";
import VehicleComponent from "./components/home/vehicle/vehicle_page.cmp";
import VehicleItvRevisions from "./components/home/itv_revisions/itv_revisions";
import VehicleMaintenances from "./components/home/maintenances/maintenances";
import VehicleMaintenancesManager from "./components/home/maintenances/maintenances_manager.cmp";
import RoutesManager from "./components/home/routes_manager/routes_manager.cmp";
import PartsManager from "./components/home/parts_manager/parts_manager.cmp";
import VehicleDataComponent from "./components/home/vehicle/vehicle_data.cmp";
import FuelComponent from "./components/home/historicals/fuel/fuel_page.cmp";
import FuelAddComponent from "./components/home/historicals/fuel/fuel_add.cmp";
import ExpensesComponent from "./components/home/historicals/expenses/expenses_page.cmp";
import ExpensesAddComponent from "./components/home/historicals/expenses/expenses_add.cmp";
// import DocumentationComponent from "./components/home/documentation/documentation_page.cmp";
// import DocumentationComponent from "./components/home/documentation/documentation_page.cmp";
import DocumentViewerComponent from "./components/home/documentation/document_viewer.cmp";
import InterventionsComponent from "./components/home/interventions/interventions.cmp";
import InterventionDataComponent from "./components/home/interventions/interventions_data.cmp";
import InterventionServicesComponent from "./components/home/interventions/interventions_services.cmp";
import InterventionAddNewServiceComponent from "./components/home/interventions/interventions_services_add_new.cmp";
import InterventionAddNew from "./components/home/interventions/interventions_add_new.cmp";
import InterventionAddNewBudgetLineComponent from "./components/home/interventions/interventions_budget_line_add.cmp";
import InterventionBudgetLineComponent from "./components/home/interventions/interventions_budget_line.cmp";

const App = () => {
  return (
    <StateProvider initialState={{ ...initialState }} reducer={mainReducer}>
      {logic.loggedIn ? (
        <AppContainer>
          <Switch>
            <PrivateRoute exact path="/home" component={HomeComponent} />
            {/* <PrivateRoute exact path="/home" component={PasswordChangePopUp} />
            {/* <PrivateRoute exact path="/home/home" component={HomeComponent} />
            // así restableceríamos el popup + modificando sidebar.json ! ! ! */}
            <PrivateRoute
              exact
              path="/home/phones"
              component={PhonesComponent}
            />
            <PrivateRoute
              exact
              path="/home/interventions"
              component={InterventionsComponent}
            />
            <PrivateRoute
              exact
              path="/home/interventions/data/:id"
              component={InterventionDataComponent}
            />
            <PrivateRoute
              exact
              path="/home/interventions/data/:id/services"
              component={InterventionServicesComponent}
            />
            <PrivateRoute
              exact
              path="/home/interventions/newservice"
              component={InterventionAddNewServiceComponent}
            />
            {/* <PrivateRoute
              exact
              path="/home/interventions/data/:id/services/:id/budget_line/:id"
              component={InterventionBudgetLineComponent}
            /> */}
            <PrivateRoute
              exact
              path="/home/interventions/data/services/budgetline/edit/:id"
              component={InterventionBudgetLineComponent}
            />
            <PrivateRoute
              exact
              path="/home/interventions/newbudgetline"
              component={InterventionAddNewBudgetLineComponent}
            />
            <PrivateRoute
              exact
              path="/home/interventions/add"
              component={InterventionAddNew}
            />
            <PrivateRoute
              exact
              path="/home/alarms"
              component={AlarmsComponent}
            />
            <PrivateRoute
              exact
              path="/home/vehicles"
              component={VehicleComponent}
            />
            <PrivateRoute
              exact
              path="/home/maintenances"
              component={VehicleMaintenances}
            />
            <PrivateRoute
              exact
              path="/home/maintenancesmanager"
              component={VehicleMaintenancesManager}
            />
            <PrivateRoute
              exact
              path="/home/routesmanager"
              component={RoutesManager}
            />
            <PrivateRoute
              exact
              path="/home/partsmanager"
              component={PartsManager}
            />
            <PrivateRoute
              exact
              path="/home/itv"
              component={VehicleItvRevisions}
            />
            <PrivateRoute
              exact
              path="/home/vehicles/data/:id"
              component={VehicleDataComponent}
            />
            <PrivateRoute exact path="/home/fuel" component={FuelComponent} />
            <PrivateRoute
              exact
              path="/home/fuel/add"
              component={FuelAddComponent}
            />
            <PrivateRoute
              exact
              path="/home/expenses"
              component={ExpensesComponent}
            />
            <PrivateRoute
              exact
              path="/home/expenses/add"
              component={ExpensesAddComponent}
            />
            {/* <PrivateRoute
              exact
              path="/home/documentation"
              component={DocumentationComponent}
            /> */}
            <PrivateRoute
              exact
              path="/home/documentation"
              component={DocumentViewerComponent}
            />
            <Redirect from="*" to="/home" />
          </Switch>
        </AppContainer>
      ) : (
        <LoginContainer>
          <Switch>
            <Route exact path="/" component={Login}></Route>
            <Redirect from="*" to="/"></Redirect>
          </Switch>
        </LoginContainer>
      )}
    </StateProvider>
  );
};

export default withRouter(App);
