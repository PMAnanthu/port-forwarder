import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import AddLinkIcon from '@mui/icons-material/AddLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

export default function MainScreen(props) {

    const [hideSave, setHideSave] = useState(true)
    const [connections, setConnections] = useState([])
    const [host, setHost] = useState('')
    const [hostError, setHostError] = useState(false)
    const [username, setUsername] = useState('')
    const [usernameError, setUsernameError] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [lport, setLPort] = useState('')
    const [lportError, setLPortError] = useState(false)
    const [rport, setRPort] = useState('')
    const [rportError, setRPortError] = useState(false)

    const handleSave = () => {
        let error = false;
        if (host === '') {
            setHostError(true)
            error = true
        }
        if (username === '') {
            setUsernameError(true)
            error = true
        }
        if (password === '') {
            setPasswordError(true)
            error = true
        }
        if (lport === '') {
            setLPortError(true)
            error = true
        }
        if (rport === '') {
            setRPortError(true)
            error = true
        }
        if (!error) {
            let connection = {
                id: username + '@' + host + ":" + lport + ">>" + rport,
                host: host,
                user: username,
                password: password,
                lport: lport,
                rport: rport,
                clinetConnection:null
            }
            if (electron.connectionApi.create(connection)) {
                setConnections([...connections, connection])
                setHost('')
                setUsername('')
                setPassword('')
                setLPort('')
                setRPort('')
                setHideSave(true)
                setConnections(electron.connectionApi.list())
            }
        }
    }


    const toggleSave = () => {
        setHideSave(!hideSave);
    }

    const handleDeleteConnection = (connection) => {
        if (electron.connectionApi.delete(connection)) {
            let connectionsArr = connections.filter(data => data.id != connection.id);
            setConnections(connectionsArr)
        }
    }

    const handleConnection = (connection) => {
        let response;
        if (connection.isConnected) {
            response = electron.connectionApi.close(connection);
        } else {
            response = electron.connectionApi.open(connection);
        }
        let connectionsArr = connections.filter(data => data.id != connection.id);
        connectionsArr.push(response);
        setConnections(connectionsArr);
    }

    const handleRefresh = () => {
        setConnections(electron.connectionApi.list())
    }

    useEffect(() => {
        setConnections(electron.connectionApi.list())
    }, [])

    return (
        <React.Fragment>
            <CssBaseline />
            <ElevationScroll {...props}>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Port Forwarder
                        </Typography>
                        <IconButton size="large" aria-haspopup="true" aria-label="add connection" color="inherit" onClick={toggleSave}>
                            {hideSave ? <AddLinkIcon /> : <LinkOffIcon />}
                        </IconButton>
                        <IconButton size="large" aria-haspopup="true" aria-label="refresh" color="inherit" onClick={handleRefresh}>
                            <RefreshIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar />
            <Container>
                <Box >
                    <Card sx={{ width: '100%' }} hidden={hideSave}>
                        <CardContent sx={{ width: '90%' }}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Host IP Address"
                                        variant="standard"
                                        sx={{ width: '100%' }}
                                        error={hostError}
                                        onChange={(e) => { setHostError(false); setHost(e.target.value) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Username"
                                        variant="standard"
                                        sx={{ width: '100%' }}
                                        error={usernameError}
                                        onChange={(e) => { setUsernameError(false); setUsername(e.target.value) }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Password"
                                        variant="standard"
                                        sx={{ width: '100%' }}
                                        type='password'
                                        error={passwordError}
                                        onChange={(e) => { setPasswordError(false); setPassword(e.target.value) }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Local Port"
                                        variant="standard"
                                        sx={{ width: '100%' }}
                                        type='number'
                                        error={lportError}
                                        onChange={(e) => { setLPortError(false); setLPort(e.target.value) }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Remote Port"
                                        variant="standard"
                                        sx={{ width: '100%' }}
                                        type='number'
                                        error={rportError}
                                        onChange={(e) => { setRPortError(false); setRPort(e.target.value) }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions style={{ display: "flex", justifyContent: "end" }} >
                            <Button variant="contained" onClick={handleSave}>Save</Button>
                        </CardActions>
                    </Card>
                    <Box sx={{ width: '100%' }} >
                        <List >
                            {connections.map((connection, index) => {
                                return (
                                    <ListItem key={index}>
                                        <Card variant="outlined" sx={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {connection.user}@{connection.host}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Local Port: {connection.lport} <br />  Remote Port: {connection.rport}
                                                </Typography>
                                            </CardContent>
                                            <CardActions style={{ display: "flex", justifyContent: "space-between" }} >
                                                <Button variant="text" onClick={() => handleDeleteConnection(connection)} >Delete</Button>
                                                <Button variant="contained" color={connection.isConnected ? 'error' : 'success'} onClick={() => handleConnection(connection)} >{connection.isConnected ? 'Disconnect' : 'Connect'}</Button>
                                            </CardActions>
                                        </Card>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
}
