import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { CardActionArea } from '@mui/material';
import Stack from '@mui/material/Stack';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Work from "./Work";

import {
    QueryClient,
    QueryClientProvider,
    useQuery
} from '@tanstack/react-query'
import * as PropTypes from "prop-types";

const queryClient = new QueryClient();

const query = "http://localhost:7200/repositories/grouping-displays?query=PREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%20PREFIX%20rdac%3A%20%3Chttp%3A%2F%2Frdaregistry.info%2FElements%2Fc%2F%3E%20PREFIX%20rdf%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%20select%20%3Fs%20(SAMPLE(%3Flabel)%20as%20%3Fl)%20where%20%7B%20%20%09%3Fs%20rdf%3Atype%20rdac%3AC10001%20.%20%20%20%20%20OPTIONAL%7B%3Fs%20rdfs%3Alabel%20%3Flabel%7D.%20%7D%20%20group%20by%20%3Fs%20order%20by%20%3Fs%20limit%20100&infer=true";

const uri = "http://localhost:7200/repositories/grouping-displays?query=";

const workSparql = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX rdac: <http://rdaregistry.info/Elements/c/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    select ?s (SAMPLE(?label) as ?l)
    where {
        ?s rdf:type rdac:C10001 .
        OPTIONAL{?s rdfs:label ?label}.
    }
    group by ?s
    order by ?s
    limit 100
`;


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

function WorkComp(props) {
    return <Card style={{"flex-shrink": 0}}>
        <CardContent>
            <CardHeader
                avatar={
                    <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                        W
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={props.entry.l.value}
                subheader={props.entry.s.value}
            />
        </CardContent>

    </Card>;
}

WorkComp.propTypes = {entry: PropTypes.any};

function Example() {
    const { isLoading, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch(uri + encodeURIComponent(workSparql), {headers: {
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