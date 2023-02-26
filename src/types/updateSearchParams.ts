type updateSearchParams<isMany extends boolean> = isMany extends true
    ? {
          createIfNotFound?: boolean;
          setDefault?: boolean;
          limit?: number;
      }
    : {
          createIfNotFound?: boolean;
          setDefault?: boolean;
      };

export default updateSearchParams;
