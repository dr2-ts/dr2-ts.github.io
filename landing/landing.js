function Copy() {
    var t = document.getElementById("CopyText").innerHTML;
    navigator.clipboard &&
        navigator.clipboard
            .writeText(t)
            .then(function () {
                Alert("The link is Copied!", "The link has now been copied, just paste it directly on any browser you'd like to play on! And that's it!", "Alright!");
            })
            .catch(function () {
                Alert("Oops! We couldn't Copy the link for you.", "No worries though! Just select the link and then hit copy!", "Alright!");
            });
}
function Alert(t, e, o) {
    $(".alert").removeClass("display-none"), $(".alert-header").text(t), $(".alert-content p").text(e), $(".alert-buttons button").text(o);
}
$(document).ready(function () {
    $(".button-tell-me-more").click(function () {
        $("html, body").animate({ scrollTop: $(".features").offset().top }, 1e3);
    }),
    $(".button-go-to-game").click(function () {
        $("html, body").animate({ scrollTop: $(".play").offset().top }, 1e3);
    }),
        $(".button-features-cta").click(function () {
            $("html, body").animate({ scrollTop: $(".referral").offset().top }, 1e3);
        }),
        $(".referral-text-cta").click(function () {
            $("html, body").animate({ scrollTop: $(".play").offset().top }, 1e3);
        }),
        $(".copy-button").click(function () {
            Copy();
        }),
        $(".alert-buttons button").click(function () {
            $(".alert").addClass("display-none");
        });
});
