require('dotenv').config();
const openaimod = require("openai");
const openaiobj = new openaimod({ apiKey: `${process.env.OPENAI_API_KEY}` });

const { Client } = require("@elastic/elasticsearch");

// Initialize Elasticsearch client
const esClient = new Client({ node: "http://localhost:9200" }); // Replace with your Elasticsearch URL

function getESmapping() {
    esmapping = {
            "mappings": {
                "properties": {
                    "addresses": {
                        "type": "nested",
                        "properties": {
                            "address": {
                                "type": "nested",
                                "properties": {
                                    "city": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    },
                                    "state": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    },
                                    "street": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    },
                                    "zipcode": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    }
                                }
                            },
                            "coordinates": {
                                "type": "nested",
                                "properties": {
                                    "latitude": {
                                        "type": "float"
                                    },
                                    "longitude": {
                                        "type": "float"
                                    }
                                }
                            },
                            "type": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            }
                        }
                    },
                    "email": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "id": {
                        "type": "long"
                    },
                    "name": {
                        "type": "text",
                        "fields": {
                            "keyword": {
                                "type": "keyword",
                                "ignore_above": 256
                            }
                        }
                    },
                    "orders": {
                        "type": "nested",
                        "properties": {
                            "date": {
                                "type": "date"
                            },
                            "items": {
                                "type": "nested",
                                "properties": {
                                    "price": {
                                        "type": "float"
                                    },
                                    "product_id": {
                                        "type": "text",
                                        "fields": {
                                            "keyword": {
                                                "type": "keyword",
                                                "ignore_above": 256
                                            }
                                        }
                                    },
                                    "quantity": {
                                        "type": "long"
                                    }
                                }
                            },
                            "order_id": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "total": {
                                "type": "float"
                            }
                        }
                    },
                    "preferences": {
                        "type": "nested",
                        "properties": {
                            "categories": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "language": {
                                "type": "text",
                                "fields": {
                                    "keyword": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "notifications": {
                                "type": "boolean"
                            }
                        }
                    }
                }
            }
    }

    return JSON.stringify(esmapping)
}

async function queryElasticsearch(englishQuery) {
    try {
        const indexName = "test_index_v4"
        const esMapping = getESmapping();

        console.log(`${englishQuery}`)
        console.log(`${esMapping}`)

        // Send the English query to OpenAI
        let prompt = `Convert the following natural language query into an Elasticsearch DSL query. 
        Take care of nested fields and text fields that are not available for aggregations and sorting. 
        If needed, use doc and not params for nested fields; or keywords. 
        handle for null situations.
        Return only the DSL in plain JSON format, without any markdown or code block:
        Natural Language Query: "${englishQuery}"
        Elasticsearch Mapping: "${esMapping}
        Elasticsearch DSL Query:`;

        prompt = `Given the mapping delimited by triple backticks \`\`\`${esMapping}\`\`\` 
        translate the text delimited by triple quotes in a valid Elasticsearch DSL query """${englishQuery}""". 
        Give me only the json code part of the answer without any markdown or code block. `

        const context = `You will help me with generating ElasticSearch DSL query. 
        I am giving the mapping of the index delimited by triple backticks \`\`\`${esMapping}\`\`\` 
        Give me only the json code part of the answer without any markdown or code block. 
        When user gives the natural language text of what is needed, revert with the corresponding DSL. 
        `
        prompt = `${englishQuery}`

        const response = await openaiobj.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `${context}`,
                },
                {
                    role: "user",
                    content: `${prompt}`,
                },
            ],
        });
      
        const elasticQuery = response.choices[0].message.content.trim();

        console.log(elasticQuery);

        try {
            // Execute the query in Elasticsearch
            const result = await esClient.search({
                index: indexName,
                body: JSON.parse(elasticQuery),
            });
            console.log("Search Results:", result);
            return {
                query: elasticQuery,
                message: "success",
                result: result
            }
        } catch (error) {
            console.error("Error:", error.message);
            return {
                query: elasticQuery,
                message: error.message,
                result: {"error": error}
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
        return {
            query: error.message,
            message: error.message,
            result: {"error": error}
        }
    }
}  
  
async function exampleUsage() {
    // Example usage
    const userQuery = "Find all documents where the home is in MI.";
    out = await queryElasticsearch(userQuery);
}

module.exports.queryes = queryElasticsearch;
  
  