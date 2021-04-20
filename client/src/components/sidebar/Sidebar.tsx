import React from "react";
import { Link } from "react-router-dom";
import classes from "./sidebar.module.css";

export default function Sidebar(): JSX.Element {
  return (
    <aside className={classes.sidebar}>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard/create-workout">Create Workout</Link>
      </nav>
    </aside>
  );
}
