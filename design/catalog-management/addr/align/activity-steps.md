# Catalog Management — Activities & Activity Steps

| Job Story | Activity | Activity Step | Description |
|-----------|----------|---------------|-------------|
| **JS1** | **Search Products** | Search products for management | Find products by name, SKU, status, category, or other criteria for editing or review |
| JS1 | **Create Product** | Submit new product | Create a product record with core attributes (name, SKU, description, product type, manufacturer) |
| JS1 | Create Product | Add technical specifications | Attach structured specifications (voltage, current, weight, dimensions, protocols, certifications) |
| JS1 | Create Product | Set initial lifecycle state | Set the product to draft, pending review, or active state |
| JS1 | **Update Product** | Update product attributes | Modify core product information (description, manufacturer details, images) |
| JS1 | Update Product | Update technical specifications | Revise specification values as corrections or new data becomes available |
| JS1 | **Discontinue Product** | Mark product as discontinued | Set product lifecycle state to discontinued with an effective date |
| JS1 | Discontinue Product | Specify replacement product | Optionally link a successor product for customers viewing the discontinued item |
| JS1 | **Import Products** | Submit bulk product import | Upload a batch of product records from a supplier feed or structured file |
| JS1 | Import Products | Review import results | Retrieve the status of a bulk import (successes, failures, validation errors) |
| **JS2** | **Upload Document** | Submit technical document | Upload a datasheet, compliance certificate, CAD file, or user manual with metadata |
| JS2 | Upload Document | Associate document with product | Link a document to one or more products |
| JS2 | **Manage Documents** | Update document metadata | Revise document title, type, version, or effective date |
| JS2 | Manage Documents | Replace document version | Upload a new version of an existing document, preserving version history |
| JS2 | Manage Documents | Remove document | Delete or archive a document that is no longer current |
| **JS3** | **Set Base Pricing** | Set product base price | Define the standard unit price for a product in a given currency |
| JS3 | Set Base Pricing | Set volume discount tiers | Define quantity-based pricing breakpoints (e.g., 10+ units at 5% off, 100+ at 15% off) |
| JS3 | **Manage Promotions** | Create promotional pricing | Define a time-limited promotional price with start and end dates |
| JS3 | Manage Promotions | Cancel promotion | End a promotional pricing period before its scheduled end date |
| JS3 | **Adjust Pricing** | Apply price adjustment to product group | Change pricing for a set of products matching criteria (category, manufacturer, product type) |
| **JS4** | **Review Inventory** | Review inventory status | Retrieve products filtered by stock level, availability state, or restock urgency |
| JS4 | **Update Stock Levels** | Set product stock quantity | Update the current stock count for a product |
| JS4 | Update Stock Levels | Set restock date | Specify when additional stock is expected from the supplier |
| JS4 | **Manage Availability** | Update lead time | Set or revise the estimated delivery lead time for a product |
| JS4 | Manage Availability | Flag product as backordered | Mark a product as available for order but not currently in stock |
| JS4 | Manage Availability | Suspend product availability | Temporarily remove a product from availability (quality hold, recall) without discontinuing it |
| **JS5** | **Manage Categories** | Create category | Add a new category to the hierarchy with parent assignment |
| JS5 | Manage Categories | Update category | Modify category name, description, or display order |
| JS5 | Manage Categories | Move category | Reassign a category's parent, reorganizing the hierarchy |
| JS5 | Manage Categories | Remove category | Delete or archive a category, reassigning its products |
| JS5 | **Categorize Products** | Assign product to category | Place a product in one or more categories |
| JS5 | Categorize Products | Remove product from category | Unassign a product from a category |
| JS5 | **Manage Facets** | Define category facets | Specify which product attributes serve as filter facets for a category |
| **JS6** | **Define Compatibility Rules** | Create compatibility rule | Define a rule specifying which component attributes must match or fall within ranges for compatibility |
| JS6 | Define Compatibility Rules | Update compatibility rule | Revise rule parameters as product specifications or domain knowledge evolves |
| JS6 | Define Compatibility Rules | Deactivate compatibility rule | Disable a rule that is no longer applicable without deleting it |
| JS6 | **Manage Component Groups** | Define component group | Create a logical grouping of component types that participate in compatibility checks (e.g., motor+ESC+battery+propeller) |
| JS6 | Manage Component Groups | Update component group | Add or remove component types from a group |
