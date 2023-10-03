const uri = "http://localhost:7200/repositories/LRMSearch-data?query=";


export function worklist(){
    const query = `
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
        limit 5
    `;
    return uri + encodeURIComponent(query);
}

export function workattributes(wid){
    const query = `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        select * where { 
            <${wid}> ?p ?o.
            ?p rdfs:label ?x .
            FILTER(LANG(?x) = "gden") 
        }
        limit 100 
    `;
    return uri + encodeURIComponent(query);
}