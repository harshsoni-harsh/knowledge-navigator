from neo4j import GraphDatabase
from config import neo4j_uri, neo4j_username, neo4j_password

class Neo4jClient:
    def __init__(self, uri, user, password):
        """
        Initialize the Neo4j client.
        :param uri: The URI of the Neo4j instance (e.g., bolt://<host>:<port>)
        :param user: Username for Neo4j authentication
        :param password: Password for Neo4j authentication
        """
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        """Close the connection to the Neo4j database."""
        self.driver.close()

    def create_node(self, label, properties):
        """
        Create a node in the Neo4j database.
        :param label: The label for the node (e.g., 'Document')
        :param properties: A dictionary of properties for the node
        """
        with self.driver.session() as session:
            session.execute_write(self._create_node, label, properties)

    @staticmethod
    def _create_node(tx, label, properties):
        query = f"CREATE (n:{label} $properties)"
        tx.run(query, properties=properties)

    def create_relationship(self, node1_label, node1_property, node2_label, node2_property, relationship):
        """
        Create a relationship between two nodes.
        :param node1_label: Label of the first node
        :param node1_property: Property to identify the first node (e.g., name)
        :param node2_label: Label of the second node
        :param node2_property: Property to identify the second node (e.g., name)
        :param relationship: The type of relationship (e.g., 'MENTIONS')
        """
        with self.driver.session() as session:
            session.execute_write(
                self._create_relationship, node1_label, node1_property, node2_label, node2_property, relationship
            )

    @staticmethod
    def _create_relationship(tx, node1_label, node1_property, node2_label, node2_property, relationship):
        query = (
            f"MATCH (a:{node1_label} {{name: $node1_property}}), (b:{node2_label} {{name: $node2_property}}) "
            f"CREATE (a)-[:{relationship}]->(b)"
        )
        tx.run(query, node1_property=node1_property, node2_property=node2_property)

    # def test_connection(self):
    #     """Test the connection to the Neo4j database."""
    #     try:
    #         with self.driver.session() as session:
    #             session.run("RETURN 1").consume()
    #         return True
    #     except Exception as e:
    #         print(f"Failed to connect to Neo4j: {e}")
    #         return False

# def main():
#     # Test the connection
#     test_client = Neo4jClient(neo4j_uri, neo4j_username, neo4j_password)
#     if test_client.test_connection():
#         print("Connected to Neo4j successfully!")
#     else:
#         print("Failed to connect to Neo4j.")

#     # Example usage
#     test_client.create_node("Document", {"name": "Sample Document", "content": "This is a sample document."})
#     test_client.create_node("Entity", {"name": "Sample Entity", "description": "This is a sample entity."})
#     test_client.create_relationship("Document", "Sample Document", "Entity", "Sample Entity", "MENTIONS")

#     # Close the client
#     test_client.close()

# if __name__ == "__main__":
#     main()