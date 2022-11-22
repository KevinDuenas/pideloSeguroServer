import { SchemaDirectiveVisitor } from '@graphql-tools/utils';

class paginate extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve } = field;
    // eslint-disable-next-line no-param-reassign
    field.resolve = async (_, args, context) => {
      const { results, count: calculateCount, params } = await resolve.apply(this, [
        _,
        args,
        context,
      ]);

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
  }
}

export default paginate;
