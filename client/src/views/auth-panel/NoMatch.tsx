import React from "react";
import { Link } from "react-router-dom";

import {
    Container,
    Card,
    CardHeader,
    CardContent,
    Typography,
    CssBaseline
} from "@material-ui/core";

import useStyles from "../../utils/styles";

function NoMatch() {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <Card className={classes.authcard}>
                <CardHeader
                    title={
                        <Typography component="h1" variant="h5">
                            {`404 | Page not found :(`}
                        </Typography>
                    }
                />
                <CardContent>
                    <p>{`Maybe the page you are looking for has been removed, or you typed in the wrong URL`}</p>
                </CardContent>
                <Link to="/" className={classes.link}>{`Back To Home`}</Link>
            </Card>
        </Container>
    );
}

export default NoMatch;