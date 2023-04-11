import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from '@mui/material/Collapse';
import Avatar from "@mui/material/Avatar";
import {red} from "@mui/material/colors";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import * as React from "react";
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as PropTypes from "prop-types";
import {useQuery} from "@tanstack/react-query";
import Stack from "@mui/material/Stack";
import CardActions from '@mui/material/CardActions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

Work.propTypes = {entry: PropTypes.any};

export default function Work(props){

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return(
        <Card key={props.entry.s.value} style={{'flex-shrink': 0}}>
            <CardContent >
                <Typography variant={"span"}>{props.entry.l.value}</Typography>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardContent>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <WorkProperties wid={props.entry.s.value}/>
            </Collapse>
        </Card>
    )}

function WorkProperties(props) {

    const uri = "http://localhost:7200/repositories/grouping-displays?query=";
    const sparql = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        select * where { 
            <${props.wid}> ?p ?o.
            ?p rdfs:label ?x .
            FILTER(LANG(?x) = "gden") 
        }
        limit 100 
    `;

    //console.log(sparql);

    const { isLoading, error, data } = useQuery({
        queryKey: [props.wid],
        queryFn: () =>
            fetch(uri + encodeURIComponent(sparql), {headers: {
                    "Accept": "application/sparql-results+json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }}).then(
                (res) => {return res.json();},
            ),
    })

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    return (
        <CardContent>{
            data.results.bindings.map(entry => (
                <Typography paragraph>{entry.x.value + ": " + entry.o.value}</Typography>
            ))
        }</CardContent>
    )
}