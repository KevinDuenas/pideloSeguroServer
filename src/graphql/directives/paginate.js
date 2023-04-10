const { mapSchema, getDirective, MapperKind } = require("@graphql-tools/utils");

// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
function paginateTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const paginateDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (paginateDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (_, args, context, info) {
          const {
            results,
            count: calculateCount,
            params,
          } = await resolve.apply(this, [_, args, context]);
          const result = {
            info: async () => {
              const { page, pageSize } = params;
              const count = await calculateCount();

              const pages = Math.ceil(count / pageSize);
              const prev = page > 1 ? page - 1 : null;
              const next = page < pages ? page + 1 : null;

              return {
                count,
                pages,
                prev,
                next,
              };
            },
            results,
          };
          return result;
        };
        return fieldConfig;
      }
    },
  });
}

export default paginateTransformer;
