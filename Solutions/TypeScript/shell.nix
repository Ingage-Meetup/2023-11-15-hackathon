let pkgs = import <nixpkgs> { };

in pkgs.mkShell {
  buildInputs = with pkgs; [
      yarn
      nodejs-18_x
  ];
}
