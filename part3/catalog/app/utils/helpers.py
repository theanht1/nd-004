

def convert_item_fields(name, description, catalog_id):
    """Convert the input fields of item to appropriate values"""
    return (name or '').strip(), (description or '').rstrip(), catalog_id
