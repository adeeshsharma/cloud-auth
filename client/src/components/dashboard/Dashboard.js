import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Dashboard = ({ auth: { user } }) => (
  <Fragment>
    <center>
      <h1 className="large text-primary"> Dashboard</h1>
      <br />
      <p className="lead">
        <i className="fas fa-user"></i>
        <b>&nbsp;{user && user.name}</b>!
      </p>

      <Fragment>LOGIN SUCCESSFUL</Fragment>
    </center>
  </Fragment>
);

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, null)(Dashboard);
