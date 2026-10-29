use std::time::Duration;

use gpui::{
    App, Application, Bounds, Context, IntoElement, Render, SharedString, Window, WindowBounds,
    WindowOptions, div, prelude::*, px, rgb, size,
};

const DEFAULT_API_URL: &str = "http://localhost:3000";

#[derive(Clone, Copy, Eq, PartialEq)]
enum ApiStatus {
    Connected,
    Unavailable,
}

fn check_api_status(api_url: &str) -> ApiStatus {
    match ureq::get(api_url).timeout(Duration::from_secs(2)).call() {
        Ok(response) if response.status() == 200 => ApiStatus::Connected,
        _ => ApiStatus::Unavailable,
    }
}

struct DesktopShell {
    api_status: ApiStatus,
    api_url: String,
    product_name: SharedString,
}

impl DesktopShell {
    fn refresh_api_status(&mut self) {
        self.api_status = check_api_status(&self.api_url);
    }
}

impl Render for DesktopShell {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<'_, Self>) -> impl IntoElement {
        let (status_label, status_color) = match self.api_status {
            ApiStatus::Connected => ("API connected", rgb(0x46fea5)),
            ApiStatus::Unavailable => ("API unavailable", rgb(0xff9592)),
        };

        div()
            .flex()
            .flex_col()
            .gap_3()
            .bg(rgb(0x0d0f12))
            .size(px(520.0))
            .justify_center()
            .items_center()
            .shadow_lg()
            .border_1()
            .border_color(rgb(0x27313d))
            .text_xl()
            .text_color(rgb(0xf5f7fa))
            .child(format!("{} Desktop", &self.product_name))
            .child(
                div()
                    .flex()
                    .items_center()
                    .gap_2()
                    .child(div().size(px(8.0)).rounded_full().bg(status_color))
                    .child(
                        div()
                            .text_sm()
                            .text_color(rgb(0xa9b1bd))
                            .child(status_label),
                    ),
            )
            .child(
                div()
                    .id("refresh-api")
                    .px_3()
                    .py_1()
                    .border_1()
                    .border_color(rgb(0x27313d))
                    .rounded_md()
                    .text_sm()
                    .text_color(rgb(0xd7dde5))
                    .cursor_pointer()
                    .child("Check again")
                    .on_click(cx.listener(|this, _, _, cx| {
                        this.refresh_api_status();
                        cx.notify();
                    })),
            )
            .child(
                div()
                    .flex()
                    .gap_3()
                    .child(div().size_8().bg(rgb(0x7dd3fc)))
                    .child(div().size_8().bg(rgb(0xa7f3d0)))
                    .child(div().size_8().bg(rgb(0xfde68a)))
                    .child(div().size_8().bg(rgb(0xfca5a5))),
            )
    }
}

fn main() {
    let api_url = std::env::var("QUORL_API_URL").unwrap_or_else(|_| DEFAULT_API_URL.to_string());
    let api_status = check_api_status(&api_url);

    Application::new().run(move |cx: &mut App| {
        let api_url = api_url.clone();
        let bounds = Bounds::centered(None, size(px(960.0), px(640.0)), cx);

        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            move |_, cx| {
                cx.new(|_| DesktopShell {
                    api_status,
                    api_url: api_url.clone(),
                    product_name: "Quorl".into(),
                })
            },
        )
        .expect("failed to open Quorl desktop window");
    });
}
