import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
//import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
//import { CardActionArea } from '@mui/material';
import Stack from '@mui/material/Stack';
//import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
//import Button from '@mui/material/Button';
//import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Work from "./Work";
import {worklist} from "./queries";

import {
    QueryClient,
    QueryClientProvider,
    useQuery
} from '@tanstack/react-query'
import * as PropTypes from "prop-types";

const queryClient = new QueryClient();


//console.log(uri + encodeURIComponent(workSparql));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
        <Box sx={{ flexGrow: 1}} m={4} >
            <Grid container spacing={2}>
                <Grid xs={12} >
                    <Paper style={{
                        padding: 12
                    }}>
                        <TextField
                            fullWidth
                            required
                            id="outlined-required"
                            label="SPARQL endpoint URI"
                            defaultValue="Hello World"
                        />
                    </Paper>
                </Grid>
                <Grid xs={6}>
                    <Example/>
                </Grid>
                <Grid xs={6}>
                    <Item>xs=6</Item>
                    <Item>xs=6</Item>
                    <Item>xs=6</Item>
                </Grid>
            </Grid>
        </Box>
        </QueryClientProvider>
    );
}

function Example() {
    const { isLoading, error, data } = useQuery({
        queryKey: ['workList'],
        queryFn: () =>
            fetch(worklist(), {headers: {
        "Accept": "application/sparql-results+json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
    }}).then(
                (res) => {return res.json();},
            ),
    })

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    return (
        <Stack spacing={1} style={{maxHeight: "700px", overflow: 'auto'}}>{
            data.results.bindings.map(entry => (
                <Work key={entry.s.value} entry={entry}/>
            ))
        }</Stack>
    )
}