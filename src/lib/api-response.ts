// ========= buildResponse =========
export function buildResponse(item: any) {
  const { current_page, limit, total_items, data } = item?.data || {}
  return {
    data: data,
    meta: {
      current_page,
      per_page: limit,
      total: total_items,
    },
  };
}

//======== buildPagination ========
export function buildPagination(data: any) {
  const { current_page, limit, total_items } = data?.data;
  return { current_page, per_page: limit, total: total_items };
}

// ======== ResponseApiErrors ========
export const ResponseApiErrors = (form: any, res: any) => {
  const errors = res?.data?.errors || res?.errors;


  if (Array.isArray(errors)) {
    errors.forEach((item: any) => {
      if (item?.field && item?.message) {
        form.setError(item.field, {
          type: "manual",
          message: item.message,
        });
      }
    });
  }
};
