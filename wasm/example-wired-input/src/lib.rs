use bindings::{
    exports::wired::script::types::{Guest, GuestScript},
    unavi::{
        scene::api::{Root, Scene},
        shapes::api::Cuboid,
    },
    wired::{
        input::handler::InputHandler,
        log::api::{log, LogLevel},
        math::types::{Transform, Vec3},
        scene::material::{Color, Material},
    },
};
use rand::Rng;

#[allow(warnings)]
mod bindings;
mod wired_math_impls;

struct Script {
    handler: InputHandler,
    material: Material,
}

impl GuestScript for Script {
    fn new() -> Self {
        let scene = Scene::new();

        let node = Cuboid::new(Vec3::splat(1.0)).to_physics_node();
        node.set_transform(Transform::from_translation(Vec3::new(0.0, 0.1, -6.0)));
        scene.add_node(&node);

        let material = Material::new();

        for primitive in node.mesh().unwrap().list_primitives() {
            primitive.set_material(Some(&material));
        }

        let handler = InputHandler::new();
        node.set_input_handler(Some(&handler));

        Root::add_scene(&scene);

        Script { handler, material }
    }

    fn update(&self, _delta: f32) {
        while let Some(event) = self.handler.handle_input() {
            log(LogLevel::Info, &format!("Got input: {:?}", event));

            let mut rng = rand::thread_rng();
            let r = rng.gen_range(0.0..1.0);
            let g = rng.gen_range(0.0..1.0);
            let b = rng.gen_range(0.0..1.0);
            let a = rng.gen_range(0.2..1.0);

            self.material.set_color(Color { r, g, b, a });
        }
    }
}

struct Types;

impl Guest for Types {
    type Script = Script;
}

bindings::export!(Types with_types_in bindings);
