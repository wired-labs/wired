#[allow(warnings)]
mod bindings;

mod button;

struct GuestImpl;

bindings::export!(GuestImpl with_types_in bindings);
